export const login_redirect_url = `https://login.iee.ihu.gr/authorization/?client_id=${import.meta.env.VITE_CLIENT_ID}&response_type=code&scope=profile&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`;
export const InfoController = '/Info/';
export const AuthClientController = '/AuthClient/';
export const CourseController = '/Course/';
export const CreateProfessorController = '/CreateProfessor/';
export const StudentsController = '/Students/'
export const AdminController = '/Admin/'
export const GAPIKEY = '.....';
export const AcceptableFileTypes = [
    "application/vnd.ms-excel",
    "application/msexcel",
    "application/x-msexcel",
    "application/x-ms-excel",
    "application/x-excel",
    "application/x-dos_ms_excel",
    "application/xls",
    "application/x-xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv"
]