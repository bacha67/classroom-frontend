import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import {
    ShowView,
    ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { bannerPhoto } from "@/lib/cloudinary";
import { ClassDetails } from "@/types";

type ClassShowResponse = {
    class: ClassDetails & {
        status?: string | null;
    };
    totals: {
        enrollments: number;
    };
};

type ClassStudent = {
    enrollmentId: number;
    student?: {
        id: string;
        name: string;
        email: string;
        role: string;
        image?: string | null;
    } | null;
    createdAt?: string;
};

const ClassesShow = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const classId = id ?? "";

    const { query } = useShow<ClassShowResponse>({
        resource: "classes",
    });

    const details = query.data?.data;
    const classDetails = details?.class;

    const studentColumns = useMemo<ColumnDef<ClassStudent>[]>(
        () => [
            {
                id: "name",
                accessorKey: "student.name",
                size: 240,
                header: () => <p className="column-title">Student</p>,
                cell: ({ row }) => {
                    const student = row.original.student;

                    if (!student) {
                        return <span className="text-muted-foreground">Unknown student</span>;
                    }

                    return (
                        <div className="flex items-center gap-2">
                            <Avatar className="size-7">
                                {student.image && (
                                    <AvatarImage src={student.image} alt={student.name} />
                                )}
                                <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col truncate">
                                <span className="truncate">{student.name}</span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {student.email}
                                </span>
                            </div>
                        </div>
                    );
                },
            },
            {
                id: "details",
                size: 140,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => {
                    const student = row.original.student;

                    if (!student) {
                        return <span className="text-muted-foreground">Unavailable</span>;
                    }

                    return (
                        <ShowButton
                            resource="users"
                            recordItemId={student.id}
                            variant="outline"
                            size="sm"
                        >
                            View
                        </ShowButton>
                    );
                },
            },
        ],
        []
    );

    const studentsTable = useTable<ClassStudent>({
        columns: studentColumns,
        refineCoreProps: {
            resource: `classes/${classId}/students`,
            pagination: {
                pageSize: 3,
                mode: "server",
            },
        },
    });

    if (query.isLoading || query.isError || !classDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="classes" title="Class Details" />
                <p className="state-message">
                    {query.isLoading
                        ? "Loading class details..."
                        : query.isError
                            ? "Failed to load class details."
                            : "Class details not found."}
                </p>
            </ShowView>
        );
    }

    const teacherName = classDetails.teacher?.name ?? "Unknown";
    const teacherInitials = teacherName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
        teacherInitials || "NA"
    )}`;
    const classStatus = classDetails.status ?? "unknown";

    return (
        <ShowView className="class-view class-show space-y-6">
            <ShowViewHeader resource="classes" title="Class Details" />

            <div className="banner">
                {classDetails.bannerUrl ? (
                    classDetails.bannerUrl.includes("res.cloudinary.com") &&
                    classDetails.bannerCldPubId ? (
                        <img
                            src={bannerPhoto(
                                classDetails.bannerCldPubId ?? "",
                                classDetails.name
                            )}
                            alt="Class Banner"
                            loading="lazy"
                        />
                    ) : (
                        <img
                            src={classDetails.bannerUrl}
                            alt={classDetails.name}
                            loading="lazy"
                        />
                    )
                ) : (
                    <div className="placeholder" />
                )}
            </div>

            <Card className="details-card">
                {/* Class Details */}
                <div>
                    <div className="details-header">
                        <div>
                            <h1>{classDetails.name}</h1>
                            <p>{classDetails.description}</p>
                        </div>

                        <div>
                            <Badge variant="outline">{classDetails.capacity} spots</Badge>
                            <Badge
                                variant={classStatus === "active" ? "default" : "secondary"}
                                data-status={classStatus}
                            >
                                {classStatus.toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    <div className="details-grid">
                        <div className="instructor">
                            <p>👨‍🏫 Instructor</p>
                            <div>
                                <img
                                    src={classDetails.teacher?.image ?? placeholderUrl}
                                    alt={teacherName}
                                />

                                <div>
                                    <p>{teacherName}</p>
                                    <p>{classDetails?.teacher?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="department">
                            <p>🏛️ Department</p>

                            <div>
                                <p>{classDetails?.department?.name}</p>
                                <p>{classDetails?.department?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Subject Card */}
                <div className="subject">
                    <p>📚 Subject</p>

                    <div>
                        <Badge variant="outline">
                            Code: <span>{classDetails?.subject?.code}</span>
                        </Badge>
                        <p>{classDetails?.subject?.name}</p>
                        <p>{classDetails?.subject?.description}</p>
                    </div>
                </div>

                <Separator />

                {/* Join Class Section */}
                <div className="join">
                    <h2>🎓 Join Class</h2>

                    <ol>
                        <li>Ask your teacher for the invite code.</li>
                        <li>Click on &quot;Join Class&quot; button.</li>
                        <li>Paste the code and click &quot;Join&quot;</li>
                    </ol>
                </div>

                <Button
                    size="lg"
                    className="w-full"
                    onClick={() => {
                        const inviteCode = classDetails.inviteCode?.trim();
                        navigate(
                            inviteCode
                                ? `/enrollments/join?inviteCode=${encodeURIComponent(inviteCode)}`
                                : "/enrollments/join"
                        );
                    }}
                >
                    Join Class
                </Button>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Enrolled Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable table={studentsTable} />
                </CardContent>
            </Card>
        </ShowView>
    );
};

const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
    return `${parts[0][0] ?? ""}${
        parts[parts.length - 1][0] ?? ""
    }`.toUpperCase();
};

export default ClassesShow;
