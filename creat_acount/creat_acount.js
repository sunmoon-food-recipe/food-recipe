document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const checkUsernameBtn = document.getElementById('check-username-btn');

    // 아이디 중복 확인 (예시)
    checkUsernameBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        // 서버로 중복 확인 요청 (예시)
        alert(`아이디 중복 확인: ${username}`);
    });

    // 회원가입 폼 제출 처리 (비밀번호 확인)
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
        } else {
            alert("회원가입 완료!");
        }
    });
});
