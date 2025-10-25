import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, User, Filter, List, Grid3X3 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Loader } from "@/components/common/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockStudentSchedule } from "@/api/mockData";
import type { Schedule } from "@/types";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

export default function Schedule() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [selectedSemester, setSelectedSemester] = useState("1");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSchedule(mockStudentSchedule);
      setLoading(false);
    }, 800);
  }, [selectedYear, selectedSemester]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading schedule..." />
      </div>
    );
  }

  const getScheduleForDayAndTime = (day: string, time: string) => {
    return schedule.find(s =>
      s.dayOfWeek === day &&
      s.startTime <= time &&
      s.endTime > time
    );
  };

  const getScheduleByDay = (day: string) => {
    return schedule.filter(s => s.dayOfWeek === day).sort((a, b) =>
      a.startTime.localeCompare(b.startTime)
    );
  };

  return (
    <div>
      <PageHeader
        title="Weekly Schedule"
        description="View your class timetable and schedule information."
        actions={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Sem 1</SelectItem>
                  <SelectItem value="2">Sem 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      {viewMode === "grid" ? (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-7 gap-1">
                  {/* Header */}
                  <div className="p-2 font-medium text-center border">Time</div>
                  {DAYS_OF_WEEK.map(day => (
                    <div key={day} className="p-2 font-medium text-center border">
                      {day}
                    </div>
                  ))}

                  {/* Time slots */}
                  {TIME_SLOTS.map(time => (
                    <>
                      <div className="p-2 text-sm text-center border bg-muted/50">
                        {time}
                      </div>
                      {DAYS_OF_WEEK.map(day => {
                        const classItem = getScheduleForDayAndTime(day, time);
                        return (
                          <div key={`${day}-${time}`} className="p-1 border min-h-[60px]">
                            {classItem && (
                              <div className="h-full p-2 bg-primary/10 rounded border-l-4 border-primary text-xs">
                                <div className="font-medium truncate">{classItem.course.title}</div>
                                <div className="text-muted-foreground">{classItem.room}</div>
                                <div className="text-muted-foreground">
                                  {classItem.startTime} - {classItem.endTime}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {DAYS_OF_WEEK.map(day => {
            const daySchedule = getScheduleByDay(day);
            return (
              <Card key={day}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {day}
                    <Badge variant="secondary">{daySchedule.length} classes</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {daySchedule.length > 0 ? (
                    <div className="space-y-3">
                      {daySchedule.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex-shrink-0">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.course.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.startTime} - {item.endTime}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {item.room}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {item.lecturer.firstName} {item.lecturer.lastName}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No classes scheduled for {day}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}