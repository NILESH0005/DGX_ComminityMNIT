import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApiContext from "../../context/ApiContext";

const AutoLogin = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { fetchData, logIn } = useContext(ApiContext);

  useEffect(() => {
    const autoLogin = async () => {
      // =========================================
      // GET PARAMETERS FROM AUTO LOGIN URL
      // =========================================

      const id = params.get("id");
      const clgShrt = params.get("clgShrt");
      const token = params.get("token");

      const name = params.get("name");
      const gender = params.get("gender");
      const state = params.get("state");
      const district = params.get("district");
      const course = params.get("course");
      const college = params.get("college");
      const mob = params.get("mob");
      const email = params.get("email");
      const prg = params.get("prg");
      const sem = params.get("sem");

      console.log("=================================");
      console.log("AUTO LOGIN FRONTEND");
      console.log("=================================");

      console.log({
        id,
        clgShrt,
        tokenReceived: !!token,
        name,
        gender,
        state,
        district,
        course,
        college,
        mob,
        email,
        prg,
        sem,
      });

      // =========================================
      // VALIDATION
      // =========================================

      if (!id || !clgShrt || !token) {
        console.error("Auto login parameters missing");

        navigate("/SignIn");
        return;
      }

      try {
        // =========================================
        // CALL BACKEND AUTO LOGIN
        // =========================================

        const queryParams = new URLSearchParams({
          id,
          clgShrt,
          token,
          name: name || "",
          gender: gender || "",
          state: state || "",
          district: district || "",
          course: course || "",
          college: college || "",
          mob: mob || "",
          email: email || "",
          prg: prg || "",
          sem: sem || "",
        });

        const res = await fetchData(
          `user/auto-login?${queryParams.toString()}`,
          "GET",
        );

        console.log("AUTO LOGIN API RESPONSE:", res);

        // =========================================
        // LOGIN FAILED
        // =========================================

        if (!res?.success) {
          console.error("Auto login failed:", res?.message);

          navigate("/SignIn");
          return;
        }

        // =========================================
        // GET DATA FROM BACKEND
        // =========================================

        const moduleId = res.data.moduleId;
        const subModuleId = res.data.subModuleId;

        console.log("Module ID:", moduleId);
        console.log("SubModule ID:", subModuleId);

        // =========================================
        // NORMAL LOGIN
        // =========================================

        await logIn(res.data.authtoken);

        // =========================================
        // FETCH MODULE DETAILS
        // =========================================

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
          console.warn("Module fetch failed:", e);
        }

        // =========================================
        // STORE LOGIN DATA
        // =========================================

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

        // =========================================
        // NAVIGATION
        // =========================================

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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-3xl mb-3">🔐</div>

        <h2 className="text-xl font-semibold">Logging you in...</h2>

        <p className="text-gray-500 mt-2">Please wait while we sign you in.</p>
      </div>
    </div>
  );
};

export default AutoLogin;
