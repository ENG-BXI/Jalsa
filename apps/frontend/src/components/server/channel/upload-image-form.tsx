import FileUploadField from '@/components/form/upload-file';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import z from 'zod';

const uploadImageSchema = z.object({
  image: z.instanceof(File, {
    message: 'Please select a server image.'
  })
});
type UploadImageFormData = z.infer<typeof uploadImageSchema>;

const UploadImageForm = ({setFile, onClose}: {setFile: (file: File) => void; onClose: () => void}) => {
  const form = useForm<UploadImageFormData>({
    resolver: zodResolver(uploadImageSchema),
    defaultValues: {
      image: undefined
    }
  });
  function handleSubmit(data: UploadImageFormData) {
    setFile(data.image);
    onClose();
  }
  return (
    <form id='upload-image-form' onSubmit={form.handleSubmit(handleSubmit)}>
      <FileUploadField
        label='Server Image'
        description='Upload an image to represent your server.'
        accept='image/png,image/jpeg,image/webp'
        control={form.control}
        register={form.register('image')}
        props={{
          id: 'chat-image'
        }}
        inputClassName='min-h-32'
      />
    </form>
  );
};

export default UploadImageForm;
