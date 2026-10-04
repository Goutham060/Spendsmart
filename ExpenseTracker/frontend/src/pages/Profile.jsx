import React, { useEffect, useState } from "react";
import { User, Mail, Save } from "lucide-react";

import { useLanguage } from "../context/LanguageContext";

import "../assets/styles/profile.css";

function Profile() {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user =
      JSON.parse(
        localStorage.getItem(
          "spendmate_user"
        )
      ) || {};

    setName(user.name || "");
    setEmail(user.email || "");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const oldUser =
      JSON.parse(
        localStorage.getItem(
          "spendmate_user"
        )
      ) || {};

    const updatedUser = {
      ...oldUser,
      name: name.trim(),
      email: email.trim(),
    };

    localStorage.setItem(
      "spendmate_user",
      JSON.stringify(updatedUser)
    );

    setMessage(
      t("profileUpdated")
    );

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  return (
    <div className="profile-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="profile-header">

        <div>

          <h1>
            {t("profile")}
          </h1>

          <p>
            {t("manageInformation")}
          </p>

        </div>

      </div>


      <div className="profile-layout">

        {/* ===================================
            PROFILE SUMMARY
        ==================================== */}

        <div className="profile-card profile-summary-card">

          <div className="profile-avatar">

            {name
              ? name
                  .charAt(0)
                  .toUpperCase()
              : "U"}

          </div>


          <h2>
            {name || t("user")}
          </h2>


          <p>
            {email ||
              t("noEmailAvailable")}
          </p>


          <span className="profile-badge">
            {t("spendMateUser")}
          </span>

        </div>


        {/* ===================================
            PROFILE FORM
        ==================================== */}

        <div className="profile-card">

          <div className="profile-card-header">

            <h2>
              {t("personalInformation")}
            </h2>

            <p>
              {t("updateAccount")}
            </p>

          </div>


          {/* SUCCESS MESSAGE */}

          {message && (
            <div className="profile-success">
              {message}
            </div>
          )}


          <form
            onSubmit={handleSubmit}
          >

            {/* FULL NAME */}

            <div className="profile-form-group">

              <label>
                {t("fullName")}
              </label>


              <div className="profile-input">

                <User size={17} />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  placeholder={t(
                    "enterYourName"
                  )}
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-form-group">

              <label>
                {t("emailAddress")}
              </label>


              <div className="profile-input">

                <Mail size={17} />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder={t(
                    "enterYourEmail"
                  )}
                  required
                />

              </div>

            </div>


            {/* SAVE */}

            <button
              type="submit"
              className="profile-save-btn"
            >
              <Save size={16} />

              {t("saveChanges")}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Profile;