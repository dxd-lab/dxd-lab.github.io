import React from "react";
import "./footer.css";

export const Footer = () => {
  return (
    <>
      <div className="footer">
        <div className="footercontent">
          <div className="info">
            Room 304, Bldg. N25, KAIST
            <br />
            291 Daehak-ro, Yuseong-gu, Daejeon (34141) <br />
            Republic of Korea
          </div>
          <div className="copyrights">
            © 2025. DxD Lab. All Rights Reserved.
          </div>
          <div className="logoContainer">
            <img className="logo" src={"/images/logo.png"} alt={"logo"} />
            <img
              className="logo"
              src={"/images/kaist.png"}
              alt={"kaist logo"}
            />
          </div>
        </div>
      </div>
    </>
  );
};
