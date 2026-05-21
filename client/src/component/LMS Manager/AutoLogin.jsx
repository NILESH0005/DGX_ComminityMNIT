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
<<<<<<< HEAD
      const moduleId = params.get("moduleId");
      const subModuleId = params.get("subModuleId");

      if (!stdId) {
=======
      const token = params.get("token");

      if (!stdId || !token) {
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
        navigate("/SignIn");
        return;
      }

      try {
<<<<<<< HEAD
        // ✅ STEP 1: Login user
        const res = await fetchData("user/auto-login", "POST", { stdId });

        if (!res?.success) {
          navigate("/SignInn");
          return;
        }

        await logIn(res.data.authtoken);

        // ✅ STEP 2: Fetch module details
=======
        // ✅ Login API
        const res = await fetchData("user/auto-login", "POST", {
          stdId,
          token,
        });

        if (!res?.success) {
          navigate("/SignIn");
          return;
        }

        // ✅ Get decrypted values from backend response
        const moduleId = res.data.moduleId;
        const subModuleId = res.data.subModuleId;

        await logIn(res.data.authtoken);

        // ✅ Fetch module details
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
        let onBackShowSubModule = 0;
        let moduleName = "Module";

        try {
          const moduleRes = await fetchData("dropdown/getModules", "GET");

          if (moduleRes?.success) {
            const module = moduleRes.data.find(
              (m) => String(m.ModuleID) === String(moduleId),
            );

<<<<<<< HEAD
            console.log("🔥 FOUND MODULE:", module);

            if (module) {
              onBackShowSubModule = module.onBackShowSubModule ?? 0;
=======
            if (module) {
              onBackShowSubModule = module.onBackShowSubModule ?? 0;

>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
              moduleName = module.ModuleName || "Module";
            }
          }
        } catch (e) {
<<<<<<< HEAD
          console.warn("Module fetch failed, using fallback");
        }

        // ✅ STEP 3: Store in localStorage
        localStorage.setItem(
          "userLoginData",
          JSON.stringify({ userId: res.data.userID }),
=======
          console.warn("Module fetch failed");
        }

        // ✅ Store localStorage
        localStorage.setItem(
          "userLoginData",
          JSON.stringify({
            userId: res.data.userID,
          }),
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
        );

        localStorage.setItem("moduleId", moduleId);
        localStorage.setItem("submoduleId", subModuleId);
        localStorage.setItem("moduleName", moduleName);
<<<<<<< HEAD
        localStorage.setItem("onBackShowSubModule", onBackShowSubModule);

        // ✅ STEP 4: Navigate (ONLY ONCE)
=======

        localStorage.setItem("onBackShowSubModule", onBackShowSubModule);

        // ✅ Navigate
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
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
<<<<<<< HEAD
        navigate("/SignInn");
=======
        navigate("/SignIn");
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
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
