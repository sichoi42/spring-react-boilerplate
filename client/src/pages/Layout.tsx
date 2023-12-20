import { getCookie } from "@/api/cookies";
import { userState } from "@/recoil/atoms";
import { User } from "@/types";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Outlet } from "react-router";
import LoadingAnimation from "@/components/LoadingAnimation";
import styled, { css } from "styled-components";
import { fecthMyInfo } from "@/api/axios.custom";

const Layout = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [myInfoData, setMyInfoData] = useState<User | null>(null);
  const setUser = useSetRecoilState<User>(userState);
  const navigate = useNavigate();

  const location = useLocation();
  const token = getCookie("access_token");

  const isRootPath: boolean = location.pathname === "/";
  const isLoginPage: boolean = location.pathname === "/login";
  const isHomePage: boolean = location.pathname === "/home";

  const getMyInfo = async () => {
    try {
      const { data: myInfo } = await fecthMyInfo();

      setMyInfoData(myInfo);
      setUser(myInfo);
      setIsValidToken(true);
      if (isRootPath || isLoginPage) {
        navigate("/home");
      }
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    console.log(`token: ${token}`);
    console.log(`isLoginPage: ${isLoginPage}`);
    if (!token && !isLoginPage) {
      navigate("/login");
    } else if (token) {
      getMyInfo();
    }
  }, []);

  return (
    <WrapperStyled>
      <MainStyled>
        <Outlet />
      </MainStyled>
    </WrapperStyled>
  );
};

export default Layout;

const WrapperStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
`;

const MainStyled = styled.main`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  user-select: none;
`;
