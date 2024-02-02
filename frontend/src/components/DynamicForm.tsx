import { useForm, useFieldArray, FieldErrors } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useEffect, useState } from 'react';
import FormDataDisplay from './FormDataDisplay';
import emailjs from "@emailjs/browser";

export type FormValues = {
  username: string;
  email: string;
  state: string;
  pending: {
    university: string,
    eligibilityCriteria: string,
    phoneNumber: string[],
    phNumbers: { number: string }[],
  }
  age: number;
  dob: Date;
}

const DynamicForm = () => {

  const form = useForm<FormValues>({
    defaultValues: {
      username: 'Jho',
      email: 'jho@hmail.com',
      state: 'Maharashtra',
      pending: {
        university: 'toce',
        eligibilityCriteria: 'B. E',
        phoneNumber: ["9052648858", "9052348768"],
        phNumbers: [{ number: '9707518216' }]
      },
      age: 0,
      dob: new Date(),
    }
  });

  const [formData, setFormData] = useState<FormValues | null>(null);


  const {
    register, control,
    handleSubmit, formState,
    watch,
    // getValues, setValue,
    reset,

  } = form;

  const {
    errors,
    // touchedFields,
    // dirtyFields,
    isDirty, isValid,
    // isSubmitting, 
    isSubmitSuccessful,
    //  submitCount
  } = formState;

  // console.table({ touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitSuccessful, submitCount, reset })


  const { fields, append, remove } = useFieldArray({ name: 'pending.phNumbers', control })

  const onSubmit = async (data: FormValues) => {
    try {
      console.group("form submitted", data);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      setFormData((prevData) => {
        return data;
      });


      await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: data?.username,
          to_name: "Avinash",
          from_email: data?.email,
          to_email: import.meta.env.VITE_APP_OWNER_EMAIL_ID,
          message: JSON.stringify(data),
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );

      console.groupEnd();
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const onError = (errors: FieldErrors<FormValues>) => {
    console.group("errors :", errors);
  }



  // const handleGetValues = () => {
  //   console.log("get values", getValues())
  // }
  // const handleSetValues = () => {
  //   setValue("username", "", { shouldTouch: true, shouldDirty: true, shouldValidate: true })
  // }

  // const watchForm = watch();

  // useEffect(() => {
  //   const subscription = watch((value) => console.log(value));
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);


  return (
    <>
      <div className='flex flex-col items-center justify-center w-full h-full px-4 py-5 bg-gray-100'>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate className='p-8 bg-white rounded-md shadow-md'>

          <div className='flex flex-col items-center mb-4'>
            <label className='w-full m-2 text-start' htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              {...register("username", { required: "Username is required" })}
              className='bg-transparent border w-full md:w-[300px] px-3 py-2 rounded-md outline-none'
            />
            <p className="text-red-500">{errors.username?.message}</p>
          </div>

          <div className='flex flex-col items-center mb-4'>
            <label className='w-full m-2 text-start' htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z-0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: 'Invalid email'
                },
                validate: {
                  notAdmin: (fieldValue) => fieldValue !== "admin@example.com" || "Enter a different email",
                  notBlackListed: (fieldValue) => !fieldValue.endsWith("baddomain.com") || "This domain not supported"
                }
              })}
              className='bg-transparent border w-full md:w-[300px] px-3 py-2 rounded-md outline-none'
            />
            <p className="text-red-500">{errors.email?.message}</p>
          </div>

          <div className='flex flex-col items-center mb-4'>
            <label className='w-full m-2 text-start' htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              {...register("state", { required: "State is required" })}
              className='bg-transparent border w-full md:w-[300px] px-3 py-2 rounded-md outline-none'
            />
            <p className="text-red-500">{errors.state?.message}</p>
          </div>

          <div className='flex flex-col items-center mb-4'>
            <label className='w-full m-2 text-start' htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              {...register("age", { valueAsNumber: true, required: { value: true, message: "Age is required" } })}
              className='bg-transparent border w-full md:w-[300px] px-3 py-2 rounded-md outline-none'
            />
            <p className="text-red-500">{errors.age?.message}</p>
          </div>

          <div className='flex flex-col items-center mb-4'>
            <label className='w-full m-2 text-start' htmlFor="dob">Dob</label>
            <input
              type="date"
              id="dob"
              {...register("dob", { valueAsDate: true, required: { value: true, message: "Date of Birth is required" } })}
              className='bg-transparent border w-full md:w-[300px] px-3 py-2 rounded-md outline-none'
            />
            <p className="text-red-500">{errors.dob?.message}</p>
          </div>

          <div className='flex flex-col items-center mb-4'>
            <label className='w-full m-2 text-start' htmlFor="university">University</label>
            <input
              type="text"
              id="university"
              {...register("pending.university", { required: "University is required" })}
              className='bg-transparent border w-full md:w-[300px] px-3 py-2 rounded-md outline-none'
            />
            <p className="text-red-500">{errors.pending?.university?.message}</p>
          </div>

          <div className='flex flex-col items-center mb-4'>
            <label className='w-full m-2 text-start' htmlFor="eligibilityCriteria">Eligibility Criteria</label>
            <input
              type="text"
              id="eligibilityCriteria"
              {...register("pending.eligibilityCriteria", { required: "Eligibility Criteria is required" })}
              className='bg-transparent border w-full md:w-[300px] px-3 py-2 rounded-md outline-none'
            />
            <p className="text-red-500">{errors.pending?.eligibilityCriteria?.message}</p>
          </div>

          <div className='flex flex-col items-center mb-4'>
            <label className='w-full m-2 text-start' htmlFor="phoneNumber">Primary Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              {...register("pending.phoneNumber.0", { required: "Primary Phone Number is required" })}
              className='bg-transparent border w-full md:w-[300px] px-3 py-2 rounded-md outline-none'
            />
            <p className="text-red-500">{errors.pending?.phoneNumber?.message}</p>
          </div>

          <div className='flex flex-col items-center mb-4'>
            <label className='w-full m-2 text-start' htmlFor="s-phoneNumber">Secondary Phone Number</label>
            <input
              type="text"
              id="s-phoneNumber"
              {...register("pending.phoneNumber.1", { disabled: watch("state") === "" })}
              className='bg-transparent border w-full md:w-[300px] px-3 py-2 rounded-md outline-none'
            />
            <p className="text-red-500">{errors.pending?.phoneNumber?.message}</p>
          </div>



          <div className='flex flex-col items-center mb-4'>
            <label className='w-full m-2 text-lg font-semibold text-start' htmlFor="phNumber">List of Phone Numbers</label>
            <div className='w-full p-4 bg-white border rounded-md'>
              {fields.map((field, index) => (
                <div key={field.id} className='flex items-center mb-2'>
                  <input
                    type="text"
                    {...register(`pending.phNumbers.${index}.number` as const, {
                      required: "Phone number is required",
                    })}
                    className='flex-1 p-2 bg-gray-100 border rounded-md focus:outline-none'
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className='px-4 py-2 ml-2 text-white bg-red-500 rounded-md'
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ number: "" })}
                className='w-full p-2 text-white bg-green-500 rounded-md'
              >
                Add Phone Number
              </button>
            </div>
          </div>


          <div className='flex flex-wrap mt-4'>
            <button
              disabled={!isDirty || !isValid}
              className='flex-1 px-4 py-2 mr-2 text-white bg-blue-800 border border-none rounded-md outline-none '
            >
              Submit
            </button>
            <button
              type='button' onClick={() => reset()}
              className='flex-1 px-4 py-2 mr-2 text-gray-700 bg-gray-300 border border-none rounded-md outline-none'
            >
              Reset
            </button>
          </div>

        </form>

        <DevTool control={control} />
        {formData && <FormDataDisplay formData={formData} />}
      </div>


    </>
  );

}

export default DynamicForm