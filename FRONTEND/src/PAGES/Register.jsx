import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [college, setCollege] = useState("");
    const [semester, setSemester] = useState("");
    const [skillsKnown, setSkillsKnown] = useState("");
    const [skillsWanted, setSkillsWanted] = useState("");
    const [error ,setError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        //phone validation 
        if(!/^[0-9]{10}$/.test(phone)){
            alert("please enter a valid 10-digit phone number");
            return;
        }
        //password validation
        const passwordPattern =
        /^(?=.*[a-z])(?=,*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if(!passwordPattern.test(password)){
            setError("password must contain atleast 8 character,one uppercase,one number and one special character"
                  );
                  return;
        }
        //confirm password validation
        if(password!==confirmpassword){
            setError("password do not match");
            return;
        }

        const skillsKnownArray = skillsKnown
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "");

        const skillsWantedArray = skillsWanted
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "");
        try{
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                confirmpassword,
                phone,
                college,
                semester,
                skillsKnown: skillsKnownArray,
                skillsWanted: skillsWantedArray,
            }),
        });

        const data = await response.text();
        console.log(data);

        if(!response.ok){
            setError(data);
            return;
        }
        alert("Registration successful!");
        navigate("/login");
    }catch(error){
        console.log("Registration error:",error);
        setError("Something went wrong.please try again");
    }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                <h1>Create Account ✨</h1>

                <p className="register-subtitle">
                    Join Student Skill Exchange and start learning together
                </p>
                {error && (
                    <p className="register-error">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="register-form-group">
                        <label> Enter your name 
                            <span className="required-star">*</span> 
                            </label>
                        <input
                            type="text"
                            placeholder="your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label>Enter your Email 
                            <span className="required-star">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="e.g.abc@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label> Enter your Phone number 
                            <span className="required-star">*</span>
                        </label>
                        <input
                            type="tel"
                            placeholder="valid 10-digit number "
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            pattern="[0-9]{10}"
                            maxLength="10"
                            required
                        />
                        <p className="field-hint">
                            Enter exactly 10 digits.
                        </p>
                    </div>

                    <div className="register-form-group">
                        <label>Enter your password 
                            <span className="required-star">*</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <p className="password-hint">
                            password must contain at least 8 characters , atleast one uppercase and also onr special character.

                        </p>
                    </div>

                    <div className="register-form-group">
                        <label>Confirm Password
                            <span className="required-star">*</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password again"
                            value={confirmpassword}
                            onChange={(e) => setConfirmpassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label> Enter your College name 
                            <span className="required-star">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder=""
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label>Enter your semester of college 
                            <span className="required-star">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder=""
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label> Enter your skills 
                            <span className="required-star">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. JavaScript, React, MongoDB"
                            value={skillsKnown}
                            onChange={(e) => setSkillsKnown(e.target.value)}
                            required
                        />
                        <p className="field-hint">
                            Separate multiple skills with commas
                        </p>
                    </div>

                    <div className="register-form-group">
                        <label>Enter skills you want to learn 
                            <span className="required-star">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Python, UI Design, Node.js"
                            value={skillsWanted}
                            onChange={(e) => setSkillsWanted(e.target.value)}
                            required
                        />
                        <p className="field-hint">
                            Separate multiple skills with commas
                        </p>
                    </div>

                    <button type="submit" className="register-btn">
                        Create Account
                    </button>

                </form>

                <p className="login-text">
                    Already have an account?
                    <span onClick={() => navigate("/login")}>
                        Login
                    </span>
                </p>

            </div>

        </div>
    );
}

export default Register;
