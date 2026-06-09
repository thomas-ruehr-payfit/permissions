import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleViewProvider } from './context/RoleViewContext';
import { OrgModeProvider } from './context/OrgModeContext';
import { DirectionProvider } from './context/DirectionContext';
import { CustomRolesProvider } from './context/CustomRolesContext';
import { UsersProvider } from './context/UsersContext';
import { RootShell } from './components/layout/RootShell';
import { AppShell } from './components/layout/AppShell';
import { AutoPlaceholder } from './pages/AutoPlaceholder';
import { InviteFlowPage } from './pages/OrgSettings/InviteFlow/index';

// Employees
import { Employees } from './pages/Employees/index';
import { EmployeeList } from './pages/Employees/EmployeeList';
import { NewHires } from './pages/Employees/NewHires';
import { Activity } from './pages/Employees/Activity';
import { Leaves } from './pages/Employees/Leaves';
import { Compensation } from './pages/Employees/Compensation';
import { Bonuses } from './pages/Employees/Bonuses';
import { Benefits } from './pages/Employees/Benefits';
import { Performance } from './pages/Employees/Performance';

// Run Payroll
import { RunPayroll } from './pages/RunPayroll/index';
import { ReviewPayroll } from './pages/RunPayroll/ReviewPayroll';
import { PayEmployees } from './pages/RunPayroll/PayEmployees';
import { PostPayroll } from './pages/RunPayroll/PostPayroll';

// Company
import { Company } from './pages/Company/index';
import { CompanyProfile } from './pages/Company/CompanyProfile';
import { Subscription } from './pages/Company/Subscription';
import { Journals } from './pages/Company/Journals';
import { Analytics } from './pages/Company/Analytics';
import { Policies } from './pages/Company/Policies';
import { RolesPermissions } from './pages/Company/RolesPermissions';
import { PayrollApproval } from './pages/Company/PayrollApproval';
import { AdminNotifications } from './pages/Company/AdminNotifications';

// Documents
import { Documents } from './pages/Documents/index';
import { DocumentsList } from './pages/Documents/DocumentsList';
import { Templates } from './pages/Documents/Templates';
import { ESignature } from './pages/Documents/ESignature';

// Overlay pages (top bar — full page, no sidebar)
import { OrgSettingsShell } from './pages/OrgSettings/OrgSettingsShell';
import { AccessPermissions } from './pages/OrgSettings/AccessPermissions';
import { PersonDetail } from './pages/OrgSettings/PersonDetail';
import { Billing } from './pages/OrgSettings/Billing';
import { Entities } from './pages/OrgSettings/Entities';
import { IntegrationsShell } from './pages/Integrations/index';
import { HelpShell } from './pages/Help/index';

const P = () => <AutoPlaceholder />;

export default function App() {
  return (
    <BrowserRouter>
      <RoleViewProvider>
        <OrgModeProvider>
        <DirectionProvider>
        <CustomRolesProvider>
        <UsersProvider>
        <Routes>
          {/* Fully standalone — own top bar, no RootShell */}
          <Route path="/org-settings/invite" element={<InviteFlowPage />} />

          <Route element={<RootShell />}>

          {/* Overlay routes — top bar stays, no sidebar */}
          <Route path="/org-settings" element={<OrgSettingsShell />}>
            <Route path="billing" element={<Billing />} />
            <Route path="entities" element={<Entities />} />
            <Route path="access-permissions" element={<AccessPermissions />} />
            <Route path="access-permissions/:userId" element={<PersonDetail />} />
          </Route>
          <Route path="/integrations" element={<IntegrationsShell />}>
            <Route path="all"       element={<P />} />
            <Route path="activated" element={<P />} />
            <Route path="api"       element={<P />} />
          </Route>
          <Route path="/help" element={<HelpShell />}>
            <Route path="centre"  element={<P />} />
            <Route path="inbox"   element={<P />} />
            <Route path="academy" element={<P />} />
          </Route>

          {/* Main app — with sidebar */}
          <Route element={<AppShell />}>{/* AppShell renders Sidebar + Outlet inside RootShell */}
            <Route path="/" element={<Navigate to="/employees/list" replace />} />

            {/* Employees */}
            <Route path="/employees" element={<Employees />}>
              <Route path="list" element={<EmployeeList />} />
              <Route path="new-hires" element={<NewHires />}>
                <Route path="ob-questionnaire" element={<P />} />
                <Route path="ob-checklist"     element={<P />} />
              </Route>
              <Route path="activity" element={<Activity />}>
                <Route path="time-planning"  element={<P />} />
                <Route path="projects"       element={<P />} />
                <Route path="time-on"        element={<P />} />
                <Route path="work-location"  element={<P />} />
                <Route path="apprenticeship" element={<P />} />
              </Route>
              <Route path="leaves" element={<Leaves />}>
                <Route path="holidays"    element={<P />} />
                <Route path="sick-leaves" element={<P />} />
                <Route path="parental"    element={<P />} />
                <Route path="unpaid"      element={<P />} />
              </Route>
              <Route path="compensation" element={<Compensation />}>
                <Route path="salary"        element={<P />} />
                <Route path="expenses"      element={<P />} />
                <Route path="contributions" element={<P />} />
              </Route>
              <Route path="bonuses"     element={<Bonuses />} />
              <Route path="benefits" element={<Benefits />}>
                <Route path="meals"     element={<P />} />
                <Route path="transport" element={<P />} />
                <Route path="medical"   element={<P />} />
                <Route path="life-ins"  element={<P />} />
                <Route path="pension"   element={<P />} />
                <Route path="training"  element={<P />} />
                <Route path="wealth"    element={<P />} />
              </Route>
              <Route path="performance" element={<Performance />}>
                <Route path="reviews"  element={<P />} />
                <Route path="surveys"  element={<P />} />
                <Route path="goals"    element={<P />} />
                <Route path="checkins" element={<P />} />
              </Route>
            </Route>

            {/* Run Payroll */}
            <Route path="/payroll" element={<RunPayroll />}>
              <Route path="review" element={<ReviewPayroll />} />
              <Route path="payments" element={<PayEmployees />}>
                <Route path="monthly"    element={<P />} />
                <Route path="advances"   element={<P />} />
                <Route path="reimburse"  element={<P />} />
                <Route path="settlement" element={<P />} />
                <Route path="past"       element={<P />} />
              </Route>
              <Route path="post" element={<PostPayroll />}>
                <Route path="accounting" element={<P />} />
                <Route path="reports"    element={<P />} />
                <Route path="docs"       element={<P />} />
              </Route>
            </Route>

            {/* Company */}
            <Route path="/company" element={<Company />}>
              <Route path="profile" element={<CompanyProfile />}>
                <Route path="general"   element={<P />} />
                <Route path="bank"      element={<P />} />
                <Route path="industry"  element={<P />} />
                <Route path="headcount" element={<P />} />
              </Route>
              <Route path="subscription" element={<Subscription />}>
                <Route path="invoices" element={<P />} />
                <Route path="plan"     element={<P />} />
              </Route>
              <Route path="journals"  element={<Journals />} />
              <Route path="analytics" element={<Analytics />}>
                <Route path="custom"   element={<P />} />
                <Route path="company"  element={<P />} />
                <Route path="register" element={<P />} />
              </Route>
              <Route path="policies" element={<Policies />}>
                <Route path="activity"     element={<P />} />
                <Route path="leaves"       element={<P />} />
                <Route path="compensation" element={<P />} />
                <Route path="bonuses"      element={<P />} />
                <Route path="benefits"     element={<P />} />
                <Route path="contracts"    element={<P />} />
              </Route>
              <Route path="roles-permissions" element={<RolesPermissions />}>
                <Route index element={<Navigate to="payroll-approval" replace />} />
                <Route path="payroll-approval" element={<PayrollApproval />} />
                <Route path="notifications"    element={<AdminNotifications />} />
              </Route>
            </Route>

            {/* Documents */}
            <Route path="/documents" element={<Documents />}>
              <Route path="list"      element={<DocumentsList />} />
              <Route path="templates" element={<Templates />}>
                <Route path="drafts"    element={<P />} />
                <Route path="generated" element={<P />} />
                <Route path="gallery"   element={<P />} />
                <Route path="custom"    element={<P />} />
              </Route>
              <Route path="esignature" element={<ESignature />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          </Route>{/* /RootShell */}
        </Routes>
        </UsersProvider>
        </CustomRolesProvider>
        </DirectionProvider>
        </OrgModeProvider>
      </RoleViewProvider>
    </BrowserRouter>
  );
}
