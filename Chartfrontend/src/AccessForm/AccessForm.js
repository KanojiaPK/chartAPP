import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation
import apiUrl from "../utils/apiURL";

const AccessForm = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate after form submission

  // Handle form submission, integrate API call
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form Values:", values);

    try {
      // Sending the data to the API
      const response = await fetch(`${apiUrl}/api/v1/log/submit-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Send form data in raw JSON format
      });

      const responseData = await response.json(); // Get the response data

      if (response.ok) {
        console.log("API Response:", responseData);

        localStorage.setItem(
          "chartData",
          JSON.stringify(responseData.chartData)
        );
        localStorage.setItem("log", JSON.stringify(responseData.log));

        navigate("/chart");
      } else {
        console.error("Error submitting form:", responseData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setSubmitting(false); // Stop submitting state after request is done
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-[#000000d7] border border-gray-300 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-[#2078d6] mb-8">
          Access Form
        </h1>

        <Formik
          initialValues={{
            access_time: "", // Empty initial value
            access_date: "", // Empty initial value
            employee_name: "", // Empty initial value
            algo_status: "", // Empty initial value for the select field
          }}
          validationSchema={Yup.object({
            access_time: Yup.string().required("Access time is required"),
            access_date: Yup.date().required("Access date is required"),
            employee_name: Yup.string().required("Employee name is required"),
            algo_status: Yup.string()
              .oneOf(
                ["Energy Saving Mode ON", "Energy Saving Mode OFF"],
                "Invalid status"
              )
              .required("Algo status is required"),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Access Time Field */}
              <div className="mb-4">
                <label
                  htmlFor="access_time"
                  className="block text-sm font-bold text-white"
                >
                  Access Time
                </label>
                <Field
                  type="time"
                  name="access_time"
                  id="access_time"
                  className="w-full px-3 py-2 border rounded shadow"
                />
                <ErrorMessage
                  name="access_time"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>

              {/* Access Date Field */}
              <div className="mb-4">
                <label
                  htmlFor="access_date"
                  className="block text-sm font-bold text-white"
                >
                  Access Date
                </label>
                <Field
                  type="date"
                  name="access_date"
                  id="access_date"
                  className="w-full px-3 py-2 border rounded shadow"
                />
                <ErrorMessage
                  name="access_date"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>

              {/* Employee Name Field */}
              <div className="mb-4">
                <label
                  htmlFor="employee_name"
                  className="block text-sm font-bold text-white"
                >
                  Employee Name
                </label>
                <Field
                  type="text"
                  name="employee_name"
                  id="employee_name"
                  placeholder="Enter First Name"
                  className="w-full px-3 py-2 placeholder-black border rounded shadow" // Add placeholder-black class
                />

                <ErrorMessage
                  name="employee_name"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>

              {/* Algo Status Dropdown */}
              <div className="mb-4">
                <label
                  htmlFor="algo_status"
                  className="block text-sm font-bold text-white"
                >
                  Algo Status
                </label>
                <Field
                  as="select"
                  name="algo_status"
                  id="algo_status"
                  className="w-full px-3 py-2 border rounded shadow"
                >
                  <option value="" disabled>
                    Choose an option
                  </option>
                  <option value="Energy Saving Mode ON">
                    Energy Saving Mode ON
                  </option>
                  <option value="Energy Saving Mode OFF">
                    Energy Saving Mode OFF
                  </option>
                </Field>
                <ErrorMessage
                  name="algo_status"
                  component="div"
                  className="text-xs text-red-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 mt-6 text-white bg-[#2078d6] rounded focus:outline-none hover:bg-[#2078d68c]"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AccessForm;
