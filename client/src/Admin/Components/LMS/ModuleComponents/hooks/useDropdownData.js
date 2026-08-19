import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import ApiContext from "../../../../../context/ApiContext";

export const useDropdownData = () => {
  const { userToken, fetchData } = useContext(ApiContext);
  const [batchOptions, setBatchOptions] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [uiTypeOptions, setUiTypeOptions] = useState([]);
  const [loadingUiTypes, setLoadingUiTypes] = useState(false);
  const [eventOptions, setEventOptions] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [lmsLevels, setLmsLevels] = useState([]);
  const [loadingLmsLevels, setLoadingLmsLevels] = useState(false);
  const [lmsUserCategories, setLmsUserCategories] = useState([]);
  const [loadingLmsUserCategories, setLoadingLmsUserCategories] =
    useState(false);

  const fetchDropdownData = async (endpoint, setter, setLoading, errorMsg) => {
    try {
      setLoading(true);
      const data = await fetchData(endpoint, "GET");
      if (data.success) {
        setter(data.data);
      } else {
        Swal.fire("Error", errorMsg, "error");
      }
    } catch (error) {
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData(
      "dropdown/geteventmaster",
      setEventOptions,
      setLoadingEvents,
      "Failed to fetch events"
    );
    fetchDropdownData(
      "dropdown/get-lms-level",
      setLmsLevels,
      setLoadingLmsLevels,
      "Failed to fetch LMS Levels"
    );
    fetchDropdownData(
      "dropdown/get-lms-user-categories",
      setLmsUserCategories,
      setLoadingLmsUserCategories,
      "Failed to fetch LMS User Categories"
    );
    fetchDropdownData(
      "dropdown/ui-type",
      setUiTypeOptions,
      setLoadingUiTypes,
      "Failed to fetch UI Types"
    );
  }, []);

  useEffect(() => {
    const fetchCourseBatches = async () => {
      const endpoint = "dropdown/course-batches";
      try {
        setLoadingBatches(true);
        const data = await fetchData(endpoint, "GET", {
          "Content-Type": "application/json",
          "auth-token": userToken,
        });
        if (data.success) {
          const sortedBatches = data.data.sort((a, b) =>
            a.batch_Name.localeCompare(b.batch_Name)
          );
          setBatchOptions(sortedBatches);
        } else {
          Swal.fire("Error", "Failed to fetch batches.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Error fetching batches.", "error");
      } finally {
        setLoadingBatches(false);
      }
    };

    if (userToken) {
      fetchCourseBatches();
    }
  }, [userToken]);

  const groupedBatches = batchOptions.reduce((acc, batch) => {
    const group = batch.batch_Group || "Others";
    if (!acc[group]) acc[group] = [];
    acc[group].push(batch);
    return acc;
  }, {});

  return {
    batchOptions,
    loadingBatches,
    groupedBatches,
    uiTypeOptions,
    loadingUiTypes,
    eventOptions,
    loadingEvents,
    lmsLevels,
    loadingLmsLevels,
    lmsUserCategories,
    loadingLmsUserCategories,
  };
};