import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Doctor, Schedule, User } from '@/lib/db/schema'
import Pfp from '@/components/pfp'
import { ScheduleDisplay } from '@/components/schedule-display'
import { useAppointmentReservationStore } from '@/components/doctors/store'
import { useState } from 'react'

export function DoctorCard({ data, book = false }: { data: { user: User, doctor: Doctor, schedules: Schedule[] }, book?: boolean }) {
    const [open, setOpen] = useState<boolean>(false)
    const { doctorId, schedule, setSchedule, setDoctorId } = useAppointmentReservationStore()

    const handleBookDoctor = (scheudle: Schedule) => {
        setDoctorId(data.doctor.id)
        setSchedule(scheudle)

        setOpen(false)
    }

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader className="flex flex-col items-center text-center">
                <Pfp image={data.user.image} className="w-20 h-20 sm:w-24 sm:h-24" />
                <CardTitle className="text-xl mb-1">{data.user.name}</CardTitle>
                <p className="text-sm text-muted-foreground">@{data.user.username}</p>
                <Badge variant="secondary" className="mb-2">{data.doctor.specialty}</Badge>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="space-y-2">
                    <p className="text-sm"><strong>Email:</strong> {data.user.email}</p>
                    <p className="text-sm"><strong>Role:</strong> {data.user.role}</p>
                    <p className="text-sm"><strong>National ID:</strong> {data.user.nationalId}</p>
                    {book ? (
                        <ScheduleDisplay
                            open={open}
                            setOpen={setOpen}
                            schedules={data.schedules}
                            onClick={(e) => handleBookDoctor(e)}
                        />
                    ) : (
                        <ScheduleDisplay
                            open={open}
                            setOpen={setOpen}
                            schedules={data.schedules}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
