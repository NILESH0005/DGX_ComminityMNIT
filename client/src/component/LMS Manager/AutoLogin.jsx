import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApiContext from "../../context/ApiContext";

const AutoLogin = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { fetchData, logIn } = useContext(ApiContext);

  useEffect(() => {
    const autoLogin = async () => {
      const stdId = params.get("stdId");
      const moduleId = params.get("moduleId");
      const subModuleId = params.get("subModuleId");

      if (!stdId) {
        navigate("/SignIn");
        return;
      }

      try {
        // ✅ STEP 1: Login user
        const res = await fetchData("user/auto-login", "POST", { stdId });

        if (!res?.success) {
          navigate("/SignInn");
          return;
        }

        await logIn(res.data.authtoken);

        // ✅ STEP 2: Fetch module details
        let onBackShowSubModule = 0;
        let moduleName = "Module";

        try {
          const moduleRes = await fetchData("dropdown/getModules", "GET");

          if (moduleRes?.success) {
            const module = moduleRes.data.find(
              (m) => String(m.ModuleID) === String(moduleId),
            );

            console.log("🔥 FOUND MODULE:", module);

            if (module) {
              onBackShowSubModule = module.onBackShowSubModule ?? 0;
              moduleName = module.ModuleName || "Module";
            }
          }
        } catch (e) {
          console.warn("Module fetch failed, using fallback");
        }

        // ✅ STEP 3: Store in localStorage
        localStorage.setItem(
          "userLoginData",
          JSON.stringify({ userId: res.data.userID }),
        );

        localStorage.setItem("moduleId", moduleId);
        localStorage.setItem("submoduleId", subModuleId);
        localStorage.setItem("moduleName", moduleName);
        localStorage.setItem("onBackShowSubModule", onBackShowSubModule);

        // ✅ STEP 4: Navigate (ONLY ONCE)
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
        navigate("/SignInn");
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
