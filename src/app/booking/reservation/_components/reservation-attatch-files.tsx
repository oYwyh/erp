"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { getErrorMessage } from "@/lib/handle-error"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { FileUploader } from "@/components/file-uploader"
import { saveMedicalFilesInDb } from "@/app/booking/reservation/actions"
import { useAppointmentReservationStore } from "@/components/doctors/store"
import { useRouter } from "next/navigation"
import LoadingBtn from "@/components/loading-btn"
import { useFileUpload } from "@/hooks/use-upload-file"
import { toast } from "sonner"

const schema = z.object({
    files: z.array(z.instanceof(File)),
})

type Schema = z.infer<typeof schema>

export default function ReservationAttatchFiles() {
    const [isLoading, setIsLoading] = React.useState(false);
    const { handleUpload } = useFileUpload();
    const reservation = useAppointmentReservationStore((state) => state.reserved);
    const setReserved = useAppointmentReservationStore((state) => state.setReserved);
    const router = useRouter();

    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            files: [],
        },
    })

    async function onSubmit(input: Schema) {
        if (!reservation.appointmentId) {
            toast.error('Please select an appointment');
            return;
        }
        setIsLoading(true);
        try {
            const uploadPromises = input.files.map(async (file) => {
                const fileName = await handleUpload(file);

                if (!fileName) {
                    setIsLoading(false);
                    throw new Error('Failed to upload file');
                }

                return saveMedicalFilesInDb({ name: fileName, type: file.type, appointmentId: reservation.appointmentId as string });
            });

            await Promise.all(uploadPromises);

            toast.success('All files have been uploaded and saved successfully');
            form.reset();
            // setReserved({ reserved: false, appointmentId: null })
            router.replace('/dashboard/appointments');
            setIsLoading(false);
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            toast.error(errorMessage);
            form.setError('files', { type: 'manual', message: errorMessage });
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-3"
            >
                <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                        <div className="space-y-6">
                            <FormItem className="w-full">
                                <FormLabel className="text-lg font-bold">Attach files for the doctor</FormLabel>
                                <FormControl>
                                    <FileUploader
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        maxFileCount={10}
                                        maxSize={5 * 1024 * 1024}
                                        disabled={isLoading}
                                        accept={{
                                            'image/*': [''],
                                            'application/pdf': [''],
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </div>
                    )}
                />
                <LoadingBtn isLoading={isLoading} label="Send Files" />
            </form>
        </Form>
    )
}