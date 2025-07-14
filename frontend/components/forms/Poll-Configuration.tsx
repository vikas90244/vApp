import React from 'react'
import { Hash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from '@radix-ui/react-label';
import { Field } from 'formik'
import { ErrorMessage } from 'formik'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "lucide-react"
import { Clock } from "lucide-react"

interface PollConfigPanleProps{
    values:any;
    errors:any;
    touched:any;
    formatDateTimeLocal:(date:Date)=>string;
}
function PollConfiguration({values,errors,touched,formatDateTimeLocal}:PollConfigPanleProps) {
  return (
    <div className='bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform duration-200'>
                                <div className="bg-yellow-400 border-b-4 border-black p-4">
                                    <div className="flex items-center gap-3">
                                        <Hash className="w-6 h-6 text-black" />
                                        <h2 className="text-2xl font-black text-black">POLL CONFIG</h2>
                                        <div className="ml-auto">
                                            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold">1</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* input field For title  */}
                                <div className="p-6 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className='space-y-2'>
                                            <Label className='text-lg font-bold text-black flex items-center gap-2'>
                                                <span className='bg-purple-500 text-white px-2 py-1 rounded text-sm '>Title</span>
                                                Poll Title
                                            </Label>
                                            <Field
                                                as={Input}
                                                name="pollTitle"
                                                type="text"
                                                placeholder="Enter poll title"
                                                className={`border-4 border-black rounded-none text-lg font-bold focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${errors.pollTitle && touched.pollTitle
                                                        ? "border-red-500 focus:border-red-500"
                                                        : "focus:border-purple-500"
                                                    }`}
                                            />
                                            <ErrorMessage name="pollTitle" component="div" className="text-red-600 font-bold text-sm" />
                                        </div>
                                    </div>
                                    {/* input filed for description */}
                                    <div className="space-y-2">
                                        <Label className="text-lg font-bold text-black flex items-center gap-2">
                                            <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">DESC</span>
                                            Description
                                        </Label>
                                        <Field
                                            as={Textarea}
                                            name="description"
                                            placeholder="What's your poll about?"
                                            className={`border-4 border-black rounded-none text-lg font-bold focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[120px] ${errors.description && touched.description
                                                    ? "border-red-500 focus:border-red-500"
                                                    : "focus:border-blue-500"
                                                }`}
                                        />
                                        <ErrorMessage name="description" component="div" className="text-red-600 font-bold text-sm" />
                                    </div>
                                </div>

                                {/* For dates  */}
                                <div className="grid md:grid-cols-2 gap-6 mb-4 px-6">
                                    <div className="space-y-2">
                                        <Label className="text-lg font-bold text-black flex items-center gap-2">
                                            <Calendar className="w-5 h-5" />
                                            <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">START</span>
                                            Poll Start Time
                                        </Label>
                                        <Field
                                            as={Input}
                                            name="pollStart"
                                            type="datetime-local"
                                            min={formatDateTimeLocal(new Date())}
                                            className={`border-4 border-black rounded-none text-lg font-bold focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${errors.pollStart && touched.pollStart
                                                    ? "border-red-500 focus:border-red-500"
                                                    : "focus:border-green-500"
                                                }`}
                                        />
                                        <ErrorMessage name="pollStart" component="div" className="text-red-600 font-bold text-sm" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-lg font-bold text-black flex items-center gap-2">
                                            <Clock className="w-5 h-5" />
                                            <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">END</span>
                                            Poll End Time
                                        </Label>
                                        <Field
                                            as={Input}
                                            name="pollEnd"
                                            type="datetime-local"
                                            min={values.pollStart || formatDateTimeLocal(new Date())}
                                            className={`border-4 border-black rounded-none text-lg font-bold focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${errors.pollEnd && touched.pollEnd
                                                    ? "border-red-500 focus:border-red-500"
                                                    : "focus:border-red-500"
                                                }`}
                                        />
                                        <ErrorMessage name="pollEnd" component="div" className="text-red-600 font-bold text-sm" />
                                    </div>
                                </div>

                            </div>
  )
}

export default PollConfiguration