import express from "express";
import {
  getDropdownValues,
  getQuizGroupDropdown,
  getQuizDropdown,
  getQuestionGroupDropdown,
  getModules,
  getSubModules,
  getUnitsWithFiles,
  getModuleById,
  getDiscussionStats,
  getBlogStats,
  getAdminModules,
  getStates,
  getDistrictsByState,
  fetchQualifications,
  fetchEventIdAndName,
  getCourseBatches,
  getUITypeList,
  fetchColleges,
  getLmsLevel,
  getLmsUserCategories,
  getApprovalUsers,
} from "../controllers/dropdown.js"; // Make sure the path is correct
import { fetchUser } from "../middleware/fetchUser.js";

const router = express.Router();

router.get("/getDropdownValues", getDropdownValues);
router.get("/getQuizGroupDropdown", getQuizGroupDropdown);
router.get("/getQuestionGroupDropdown", getQuestionGroupDropdown);
router.get("/getQuizDropdown", getQuizDropdown);
router.get("/getModules", getModules);
router.get("/getAdminModules", fetchUser, getAdminModules);
router.get("/getSubModules", getSubModules);
router.get("/getModuleById", getModuleById);
router.get("/getUnitsWithFiles/:subModuleId", fetchUser, getUnitsWithFiles);
router.get("/discussionStats", fetchUser, getDiscussionStats);
router.get("/blogStats", getBlogStats);
router.get("/states", getStates);
router.get("/districts/:state", getDistrictsByState);
router.get("/colleges", fetchColleges);
router.get("/qualifications", fetchQualifications);
router.get("/geteventmaster", fetchEventIdAndName);
router.get("/course-batches", getCourseBatches);
router.get("/ui-type", getUITypeList);
router.get("/get-lms-level", getLmsLevel);
router.get("/get-lms-user-categories", getLmsUserCategories);
router.get("/getApprovalUsers", fetchUser, getApprovalUsers);

export default router;
