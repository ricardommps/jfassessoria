import { Controller, useFormContext } from 'react-hook-form';

import PreviewImage from './preview-image';
export function RHFImage({ name, handleClearImage, onClick }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div>
          <PreviewImage
            imgUrl={field.value}
            handleClearImage={handleClearImage}
            onClick={onClick}
          />
        </div>
      )}
    />
  );
}
