import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BookOpen, Building2, GraduationCap, Home, Layers, Users } from "lucide-react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import "./App.css";
import { Layout } from "@/components/refine-ui/layout/layout";
import { Toaster } from "@/components/refine-ui/notification/toaster";
import { authProvider } from "@/providers/auth";
import { dataProvider } from "@/providers/data";
import ClassesCreate from "@/pages/classes/create";
import ClassesList from "@/pages/classes/list";
import ClassesShow from "@/pages/classes/show";
import Dashboard from "@/pages/dashboard";
import DepartmentsCreate from "@/pages/departments/create";
import DepartmentsList from "@/pages/departments/list";
import DepartmentShow from "@/pages/departments/show";
import EnrollmentConfirm from "@/pages/enrollments/confirm";
import EnrollmentsCreate from "@/pages/enrollments/create";
import EnrollmentsJoin from "@/pages/enrollments/join";
import FacultyList from "@/pages/faculty/list";
import FacultyShow from "@/pages/faculty/show";
import { Login } from "@/pages/login";
import { Register } from "@/pages/register";
import SubjectsCreate from "@/pages/subjects/create";
import SubjectsList from "@/pages/subjects/list";
import SubjectsShow from "@/pages/subjects/show";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <DevtoolsProvider>
          <Refine
            authProvider={authProvider}
            dataProvider={dataProvider}
            routerProvider={routerProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: "JiNM7k-eg879x-jDSypG",
              title: {
                text: "Classroom",
                icon: <GraduationCap className="h-5 w-5" />,
              },
            }}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: { label: "Home", icon: <Home className="h-4 w-4" /> },
              },
              {
                name: "departments",
                list: "/departments",
                create: "/departments/create",
                show: "/departments/show/:id",
                meta: { label: "Departments", icon: <Building2 className="h-4 w-4" /> },
              },
              {
                name: "subjects",
                list: "/subjects",
                create: "/subjects/create",
                show: "/subjects/show/:id",
                meta: { label: "Subjects", icon: <BookOpen className="h-4 w-4" /> },
              },
              {
                name: "classes",
                list: "/classes",
                create: "/classes/create",
                show: "/classes/show/:id",
                meta: { label: "Classes", icon: <Layers className="h-4 w-4" /> },
              },
              {
                name: "users",
                list: "/faculty",
                show: "/faculty/show/:id",
                meta: { label: "Faculty", icon: <Users className="h-4 w-4" /> },
              },
              {
                name: "enrollments",
                create: "/enrollments/create",
                meta: { label: "Enrollments" },
              },
            ]}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }
              >
                <Route index element={<Dashboard />} />

                <Route path="departments">
                  <Route index element={<DepartmentsList />} />
                  <Route path="create" element={<DepartmentsCreate />} />
                  <Route path="show/:id" element={<DepartmentShow />} />
                </Route>

                <Route path="subjects">
                  <Route index element={<SubjectsList />} />
                  <Route path="create" element={<SubjectsCreate />} />
                  <Route path="show/:id" element={<SubjectsShow />} />
                </Route>

                <Route path="classes">
                  <Route index element={<ClassesList />} />
                  <Route path="create" element={<ClassesCreate />} />
                  <Route path="show/:id" element={<ClassesShow />} />
                </Route>

                <Route path="faculty">
                  <Route index element={<FacultyList />} />
                  <Route path="show/:id" element={<FacultyShow />} />
                </Route>

                <Route path="enrollments">
                  <Route path="create" element={<EnrollmentsCreate />} />
                  <Route path="join" element={<EnrollmentsJoin />} />
                  <Route path="confirm" element={<EnrollmentConfirm />} />
                </Route>
              </Route>

              <Route path="*" element={<CatchAllNavigate to="/" />} />
            </Routes>

            <Toaster />
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
          <DevtoolsPanel />
        </DevtoolsProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
