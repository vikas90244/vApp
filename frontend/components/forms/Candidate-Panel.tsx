import React from 'react'
import { Field, FieldArray, ErrorMessage } from 'formik'
import { Users, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CandidatePanelProps{
    values:any;
    errors:any;
    touched:any;
}
function CandidatePanel({values,errors,touched}:CandidatePanelProps) {
  return (
    <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 transition-transform duration-200">
      <div className="bg-purple-500 border-b-4 border-black p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-black text-white">CANDIDATES</h2>
            <div className="bg-white text-purple-500 px-3 py-1 rounded-full font-black">
              {values.candidates.length}/5
            </div>
          </div>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-purple-500 font-bold">2</span>
          </div>
        </div>
      </div>


      <div className="p-6 space-y-4">
        <FieldArray name="candidates">
          {({ push, remove }) => (
            <>
              {values.candidates.map((candidate, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border-4 border-black bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-black rounded-full flex items-center justify-center transform -rotate-12">
                      <span className="text-black font-black text-xl">{index + 1}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <Field
                      as={Input}
                      name={`candidates.${index}.name`}
                      placeholder={`Candidate ${index + 1} name`}
                      className={`border-4 border-black rounded-none text-lg font-bold focus:ring-0 bg-white ${errors.candidates?.[index]?.name && touched.candidates?.[index]?.name
                        ? "border-red-500 focus:border-red-500"
                        : "focus:border-orange-500"
                      }`}
                    />
                    <ErrorMessage
                      name={`candidates.${index}.name`}
                      component="div"
                      className="text-red-600 font-bold text-sm mt-1"
                    />
                  </div>

                  {values.candidates.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-500 hover:bg-red-600 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all font-black"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              ))}

              {values.candidates.length < 5 && (
                <Button
                  type="button"
                  onClick={() => push({ name: "" })}
                  className="w-full py-6 bg-white hover:bg-gray-50 border-4 border-dashed border-black rounded-none text-black font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <Plus className="w-6 h-6 mr-2" />
                  ADD ANOTHER CANDIDATE!
                </Button>
              )}

              {/* Custom error display for candidates array */}
              {typeof errors.candidates === "string" && touched.candidates && (
                <div className="text-red-600 font-bold text-sm">{errors.candidates}</div>
              )}
            </>
          )}
        </FieldArray>
      </div>
    </div>
  )
}

export default CandidatePanel
