import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApiContext from "../../context/ApiContext";

const AutoLogin = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { fetchData, logIn } = useContext(ApiContext);

  useEffect(() => {
    const autoLogin = async () => {
      // const stdId = params.get("stdId");
      // const token = params.get("token");
      // const collegeName = params.get("collegeName");
      const ds = params.get("ds");
      const mn = params.get("mn");
      const token = params.get("token");

      if (!ds || !mn || !token) {
        navigate("/SignInn");
        return;
      }

      try {
        // ✅ Login API
        const res = await fetchData("user/auto-login", "POST", {
          ds,
          mn,
          token,
        });

        if (!res?.success) {
          navigate("/SignInn");
          return;
        }

        // ✅ Get decrypted values from backend response
        const moduleId = res.data.moduleId;
        const subModuleId = res.data.subModuleId;

        await logIn(res.data.authtoken);

        // ✅ Fetch module details
        let onBackShowSubModule = 0;
        let moduleName = "Module";

        try {
          const moduleRes = await fetchData("dropdown/getModules", "GET");

          if (moduleRes?.success) {
            const module = moduleRes.data.find(
              (m) => String(m.ModuleID) === String(moduleId),
            );

            if (module) {
              onBackShowSubModule = module.onBackShowSubModule ?? 0;
              moduleName = module.ModuleName || "Module";
            }
          }
        } catch (e) {
          console.warn("Module fetch failed");
        }

        // ✅ Store localStorage
        localStorage.setItem(
          "userLoginData",
          JSON.stringify({
            userId: res.data.userID,
          }),
        );

        localStorage.setItem("moduleId", moduleId);
        localStorage.setItem("submoduleId", subModuleId);
        localStorage.setItem("moduleName", moduleName);

        localStorage.setItem("onBackShowSubModule", onBackShowSubModule);

        // ✅ Navigate
        if (subModuleId) {
          const encodedId = btoa(subModuleId.toString());

          navigate(`/submodule/${encodedId}`, {
            replace: true,
            state: {
              moduleId,
              moduleName,
              onBackShowSubModule,
            },
          });
        } else {
          navigate("/LearningPathNative");
        }
      } catch (err) {
        console.error("AutoLogin failed:", err);
        navigate("/SignIn");
      }
    };

    autoLogin();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">🔐 Logging you in...</p>
    </div>
  );
};

export default AutoLogin;
