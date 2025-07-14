"use client";

import { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, FormikHelpers } from "formik";
import { Rocket, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Web3Head from "@/components/header/Web3Head";
import BubbleHead from "@/components/header/bubleHead";
import Footer from "@/components/header/Footer";
import IsSubmit from "@/components/buttons/Is-Submit";
import PollConfiguration from "./Poll-Configuration";
import CandidatePanel from "./Candidate-Panel";
import { PollFormValues, Candidate } from "@/utils/interface";
import { formatDateTimeLocal } from "@/utils/helper";
import AirdropPrompt from "@/components/AirdropPrompt";
import { usePoll } from "@/hooks/usePoll";

const pollValidationSchema = Yup.object({
  pollTitle: Yup.string()
    .required("Title is required")
    .min(4, "Title must be minimum 4 character long")
    .max(50, "Title must be less than 50 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),

  pollStart: Yup.date()
    .required("Poll start time is required")
    .min(new Date(), "Poll start time must be in the future"),

  pollEnd: Yup.date()
    .required("Poll end time is required")
    .min(Yup.ref("pollStart"), "Poll end time must be after start time"),

  candidates: Yup.array()
    .of(
      Yup.object({
        name: Yup.string()
          .required("Candidate name is required")
          .min(1, "Candidate name must be at least 2 characters")
          .max(50, "Candidate name must be less than 50 characters"),
      }),
    )

    .min(2, "At least 2 candidates are required")
    .max(5, "Maximum 5 candidates allowed"),
});

const initialValues: PollFormValues = {
  pollTitle: "",
  description: "",
  pollStart: "",
  pollEnd: "",
  candidates: [{ name: "" }, { name: "" }],
};

function PollForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const {deployPollSolana} = usePoll();
  // function to handle submission

  const handleSubmit = async (
  values: PollFormValues,
  { resetForm }: FormikHelpers<PollFormValues>,
) => {
  setIsSubmitting(true);
  setSubmitError("");

  try {
    // wait until both Solana and backend succeed
    await deployPollSolana.mutateAsync(values);

    // only if everything succeeded
    resetForm({
      values: { ...initialValues },
      errors: {},
      touched: {},
    });

    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  } catch (error) {
    console.error("Error deploying poll:", error);
    setSubmitError("Failed to deploy poll. Please try again!");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="p-4 min-h-screen">
      {/* Airdrop prompt modal for empty wallet */}

      <AirdropPrompt amount={2} minSol={0.1} />

      <div className="max-w-3xl mx-auto">
        <Web3Head />

        {/* Speech bubble */}

        <BubbleHead />

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={pollValidationSchema}
        >
          {({ values, errors, touched, isValid }) => (
            <Form className="space-y-8 mt-4">
              {/* Poll configuration panel */}

              <PollConfiguration
                values={values}
                errors={errors}
                touched={touched}
                formatDateTimeLocal={formatDateTimeLocal}
              />

              <CandidatePanel
                values={values}
                errors={errors}
                touched={touched}
              />

              {/* Error Display */}

              {submitError && (
                <div className="bg-red-100 border-4 border-red-500 rounded-none p-4 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500" />

                    <p className="font-black text-red-700">{submitError}</p>
                  </div>
                </div>
              )}

              {/* Success Display */}

              {submitSuccess && (
                <div className="bg-green-100 border-4 border-green-500 rounded-none p-4 shadow-[4px_4px_0px_0px_rgba(34,197,94,1)] animate-pulse">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />

                    <p className="font-black text-green-700">
                      POLL DEPLOYED SUCCESSFULLY! 🚀
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center">
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all font-black text-black text-2xl px-12 py-6 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${isSubmitting ? "animate-pulse" : ""
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-8 h-8 mr-3 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                      DEPLOYING...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-8 h-8 mr-3" />
                      DEPLOY TO SOLANA!
                    </>
                  )}
                </Button>

                {/* Action lines around button */}

                {!isSubmitting && <IsSubmit />}
              </div>
            </Form>
          )}
        </Formik>

        {/* Footer speech bubble */}

        <Footer />
      </div>
    </div>
  );
}

export default PollForm;
