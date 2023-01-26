
const setAuthState = (context:any, authState: boolean) => {
    context.commit('setAuthState', authState);
}
const setIsTeacherState = (context:any, teacherState: boolean) => {
    context.commit('setIsTeacherState', teacherState);
}
const setIsStudentState = (context:any, studentState: boolean) => {
    context.commit('setIsStudentState', studentState);
}

export default { setAuthState,setIsTeacherState,setIsStudentState };