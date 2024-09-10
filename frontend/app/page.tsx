'use client';
import { GenerateImageButton } from '@/components/Button';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import Image from 'next/image';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import * as Yup from 'yup';
import GuidanceSlider from '@/components/GuidanceSlider';
import { FormSubmitValue } from '@/types';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { getImageSettings } from '../utils';
import toast from 'react-hot-toast';
import { useAppContext } from '@/context';

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string>('/assets/Box-shape.png');
  const context = useAppContext();
  useEffect(() => {
    return () => sessionStorage.removeItem('imageSettings');
  });
  const onSubmitHandler = (values: FormSubmitValue, helper: FormikHelpers<FormSubmitValue>) => {
    helper.setSubmitting(true);
    setImageSrc('/assets/Box-shape.png');
    const [width, height] = values.resolution.split(' x ').map((val) => Number.parseInt(val));
    let status: number;
    fetch('/api/image/generate', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        prompt: values.prompt,
        negative_prompt: values.negativePrompt,
        color: values.color,
        width,
        height,
        guidance: Number.parseFloat(values.guidance.toString()),
        seed: values.seed
      })
    })
      .then(async (res) => {
        status = res.status;
        if (res.ok) {
          return await res.blob();
        } else {
          toast.error('Something went wrong. Please try again!');
          helper.setSubmitting(false);
        }
      })
      .then((data) => {
        if (data) {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            setImageSrc(reader.result as string);
          });
          reader.addEventListener('loadend', () => {
            helper.setSubmitting(false);
          });
          reader.addEventListener('error', () => {
            helper.setSubmitting(false);
          });
          reader.readAsDataURL(data);
        }
      })
      .catch(() => {
        toast.error('Something went wrong. Please try again!');
        helper.setSubmitting(false);
      })
      .finally(() => {
        if (status === 401) {
          context.setAuth(false);
        }
      });
  };
  return (
    <main className="main-layout flex gap-10 flex-col-reverse lg:flex-row w-full pb-14 overflow-y-auto">
      <Formik
        initialValues={getImageSettings() as any}
        validationSchema={Yup.object().shape({
          prompt: Yup.string()
            .trim()
            .min(20, ({ min }) => `Prompt must be at least ${min} characters long`)
            .max(500, ({ max }) => `Prompt must be no more than ${max} characters long`)
            .required('Prompt is required'),
          negativePrompt: Yup.string()
            .trim()
            .min(20, ({ min }) => `Negative prompt must be at least ${min} characters long`)
            .max(500, ({ max }) => `Negative prompt must be no more than ${max} characters long`),
          color: Yup.string().required('Color is required'),
          resolution: Yup.string().required('Resolution is required'),
          guidance: Yup.number().required('Guidance is required')
        })}
        onSubmit={onSubmitHandler}
      >
        {({ handleBlur, values, handleChange, errors, touched, isSubmitting, isValid }) => {
          const [width, height] = values.resolution.split(' x ').map((val) => Number.parseInt(val));
          const isDefaultImage = imageSrc === '/assets/Box-shape.png';
          return (
            <>
              <Form className="flex flex-col gap-[40px] h-fit">
                <div className="flex flex-col gap-4">
                  <label htmlFor="prompt" className="text-colDark60 capitalize font-semibold">
                    Prompt
                  </label>
                  <TextareaAutosize
                    id="prompt"
                    name="prompt"
                    placeholder="Enter the prompt"
                    className={`bg-colDark80 p-4 rounded-xl text-colWhite80 placeholder-colDark60 outline-none ${errors.prompt && touched.prompt ? 'border-colRed border-2' : 'border-none'} text-lg resize-none overflow-hidden`}
                    maxRows={10}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.prompt}
                  />
                  <ErrorMessage component="span" name="prompt" className="text-colRed" />
                </div>
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="negativePrompt"
                    className="text-colDark60 capitalize font-semibold"
                  >
                    Negative Prompt (Optional)
                  </label>
                  <TextareaAutosize
                    id="negativePrompt"
                    name="negativePrompt"
                    placeholder="Enter the prompt"
                    className={`bg-colDark80 p-4 rounded-xl text-colWhite80 placeholder-colDark60 outline-none ${errors.negativePrompt && touched.negativePrompt ? 'border-colRed border-2' : 'border-none'} text-lg resize-none overflow-hidden`}
                    maxRows={10}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.negativePrompt}
                  />
                  <ErrorMessage component="span" name="negativePrompt" className="text-colRed" />
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="colors" className="text-colDark60 capitalize font-semibold">
                    Colors
                  </label>
                  <div id="colors" className="flex gap-3">
                    <Field
                      type="radio"
                      name="color"
                      value="#dd524c"
                      id="color-1"
                      className="hidden"
                      checked={values.color === '#dd524c'}
                    />
                    <label htmlFor="color-1" className="color-label bg-colRed" />

                    <Field
                      type="radio"
                      name="color"
                      value="#e87b35"
                      id="color-2"
                      className="hidden"
                      checked={values.color === '#e87b35'}
                    />
                    <label htmlFor="color-2" className="color-label bg-colOrange" />

                    <Field
                      type="radio"
                      name="color"
                      value="#5ec269"
                      id="color-3"
                      className="hidden"
                      checked={values.color === '#5ec269'}
                    />
                    <label htmlFor="color-3" className="color-label bg-colGreen" />

                    <Field
                      type="radio"
                      name="color"
                      value="#4e80ee"
                      id="color-4"
                      className="hidden"
                      checked={values.color === '#4e80ee'}
                    />
                    <label htmlFor="color-4" className="color-label bg-colSky" />
                    <Field
                      type="radio"
                      name="color"
                      value="#9d59ef"
                      id="color-5"
                      className="hidden"
                      checked={values.color === '#9d59ef'}
                    />
                    <label htmlFor="color-5" className="color-label bg-colPurple" />

                    <Field
                      type="radio"
                      name="color"
                      value="#e4e4e7"
                      id="color-6"
                      className="hidden"
                      checked={values.color === '#e4e4e7'}
                    />
                    <label htmlFor="color-6" className="color-label bg-colWhite80" />

                    <Field
                      type="radio"
                      name="color"
                      value="none"
                      id="color-7"
                      className="hidden"
                      checked={values.color === 'none'}
                    />
                    <label
                      htmlFor="color-7"
                      className="color-label border-colDark60 border-[2px] p-2"
                    >
                      <Image src={'/assets/Close.svg'} width={45} height={45} alt="none" />
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="resolution" className="text-colDark60 capitalize font-semibold">
                    Resolution
                  </label>
                  <div id="resolution" className="flex gap-3 flex-wrap text-colWhite80">
                    <Field
                      type="radio"
                      name="resolution"
                      id="resolution-1"
                      className="hidden"
                      value="1024 x 1024"
                      checked={values.resolution === '1024 x 1024'}
                    />
                    <label htmlFor="resolution-1" className="resolution-lable">
                      1024 x 1024 (1:1)
                    </label>

                    <Field
                      type="radio"
                      name="resolution"
                      id="resolution-2"
                      className="hidden"
                      value="1152 x 896"
                      checked={values.resolution === '1152 x 896'}
                    />
                    <label htmlFor="resolution-2" className="resolution-lable">
                      1152 x 896 (9:7)
                    </label>

                    <Field
                      type="radio"
                      name="resolution"
                      id="resolution-3"
                      className="hidden"
                      value="869 x 1152"
                      checked={values.resolution === '869 x 1152'}
                    />
                    <label htmlFor="resolution-3" className="resolution-lable">
                      869 x 1152 (7:9)
                    </label>

                    <Field
                      type="radio"
                      name="resolution"
                      id="resolution-4"
                      className="hidden"
                      value="1344 x 768"
                      checked={values.resolution === '1344 x 768'}
                    />
                    <label htmlFor="resolution-4" className="resolution-lable">
                      1344 x 768 (7:4)
                    </label>

                    <Field
                      type="radio"
                      name="resolution"
                      id="resolution-5"
                      className="hidden"
                      value="768 x 1344"
                      checked={values.resolution === '768 x 1344'}
                    />
                    <label htmlFor="resolution-5" className="resolution-lable">
                      768 x 1344 (4:7)
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <label htmlFor="guidance" className="text-colDark60 capitalize font-semibold">
                    Guidance ({values.guidance.toFixed(1)})
                  </label>
                  <GuidanceSlider
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={0}
                    max={10}
                    step={0.1}
                    value={values.guidance}
                    id="guidance"
                    name="guidance"
                    track={false}
                  />
                </div>
                <GenerateImageButton
                  className={`rounded-xl font-semibold text-lg py-3${isValid ? ' active' : ''} text-colWhite80`}
                  type="submit"
                  startIcon={
                    <Image src="/assets/Magic.svg" width={30} height={30} alt="magic icon" />
                  }
                >
                  Generate Image
                </GenerateImageButton>
              </Form>
              <div className="bg-colDark80 rounded-lg w-[100%] xl:w-[45rem] h-[30rem] md:h-[35rem] lg:h-[38rem] flex items-center justify-center relative border-[5px] border-colDark80">
                {isSubmitting && (
                  <div className="backdrop-blur-lg absolute top-0 bottom-0 left-0 right-0 rounded-lg flex">
                    <CircularProgress className="m-auto text-colMedSlateBlue" />
                  </div>
                )}
                <Image
                  src={imageSrc}
                  alt="placeholder"
                  width={isDefaultImage ? 300 : width}
                  height={isDefaultImage ? 300 : height}
                  className={`${isDefaultImage ? '' : 'w-[100%] h-[100%] '}rounded-lg`}
                />
              </div>
            </>
          );
        }}
      </Formik>
    </main>
  );
}
