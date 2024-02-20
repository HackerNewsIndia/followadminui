import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FollowSpace.css";
import FollowSpaceCreator from "./FollowSpaceCreator";
import jwt_decode from "jwt-decode";

function FollowSpace({ isLoggedIn, setIsLoggedIn, selectedKey }) {
  // const [userDetails, setUserDetails] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCompany, setSelectedCompany] = useState(null);
  //   const [selectedKey, setSelectedKey] = useState(null);
  const [companyData, setCompanyData] = useState([]);
  const [followSpaces, setFollowSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);

  const navigate = useNavigate();

  const handleNewBlog = (newCompany) => {
    setCompanyData((prevData) => [...prevData, newCompany]);
  };

  const handleCards = (company) => {
    setSelectedCompany(company);
  };

  const handleManage = (space) => {
    setSelectedSpace(space);
  };
  console.log("you have selected", selectedCompany);
  console.log("you have selected this followSpace", selectedSpace);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No JWT token found in local storage.");
      return;
    }

    // Decode the JWT token to get the user_id
    const decodedToken = jwt_decode(token);
    const user = decodedToken.user;
    const userId = user.id;

    fetch(
      `https://diaryblogapi.onrender.com/api/diaryblog_space/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setCompanyData(data);
      })
      .catch((error) => {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    console.log("useEffect for fetching follow spaces is running");

    const fetchFollowSpacesForCompanies = async () => {
      try {
        const companyIdsandNames = companyData.map((company) => ({
          id: company._id,
          name: company.name,
        }));

        const response = await fetch(
          `https://diaryblogapi.onrender.com/api/follow_spaces`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ companyIdsandNames }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setFollowSpaces(data);
      } catch (err) {
        console.error("There was an error fetching the follow spaces:", err);
        setError(err.message);
      }
    };

    fetchFollowSpacesForCompanies();
  }, [companyData]);

  console.log("Company Data:", companyData);
  console.log("follow_space Data:", followSpaces);

  return (
    <div className="menu-container">
      {selectedKey === "followAdmin" && (
        <div className="content-body">
          {selectedCompany ? (
            <div>
              {/* <h1 className="company_heading">{selectedCompany.company}</h1>
        <button
          className="back_button"
          onClick={() => setSelectedCompany(null)}
        >
          <i className="fas fa-arrow-left" aria-hidden="true"></i>
        </button>
        <CompanyPosts selectedCompany={selectedCompany} /> */}
            </div>
          ) : (
            <React.Fragment>
              {selectedSpace ? (
                // This is the content that shows when a followSpace is selected
                <div className="email-table-container">
                  <button
                    className="email-back-button"
                    onClick={() => setSelectedSpace(null)}
                  >
                    Back
                  </button>
                  <table className="email-table">
                    <thead>
                      <tr>
                        <th>User Emails</th>
                        <th>Followed Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSpace.userEmails.map((email, index) => (
                        <tr key={index}>
                          <td>{email}</td>
                          <td>
                            {selectedSpace.createDate
                              ? new Date(
                                  selectedSpace.createDate
                                ).toLocaleDateString()
                              : "Loading..."}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div>
                  {/* {error && <p>Error: {error}</p>} */}
                  <div className="content heading_row">
                    <h1 className="dairyBlogAdmin_h1">FollowSpace</h1>
                  </div>
                  <br />
                  <div className="row">
                    <FollowSpaceCreator />
                  </div>
                  <div className="blog-content">
                    <h3 className="blog-h3">My Follow Spaces</h3>
                    <div className="blog-card-container">
                      {followSpaces &&
                        followSpaces.map((space) => (
                          <div
                            key={space._id || space.blogSpace}
                            className="blog-card"
                            // onClick={() => handleCards(space)}
                          >
                            <h4 className="followSpace-title">
                              {space.companyName}
                            </h4>
                            <p className="followSpace-date">
                              <strong>Created Date:</strong>
                              {space.createDate
                                ? new Date(
                                    space.createDate
                                  ).toLocaleDateString()
                                : "Loading..."}
                            </p>
                            <button
                              className="followSpace_manage"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents the event from bubbling up
                                handleManage(space);
                              }}
                            >
                              Manage
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
}

export default FollowSpace;
