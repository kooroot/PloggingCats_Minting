import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect, updateAccount } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import ProgressBar from "@ramonak/react-progress-bar";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import Slide from "./Slide";
import "./styles/App.css";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: #ff5101;
  padding: 10px;
  font-weight: bold;
  color: #fff;
  width: 100px;
  cursor: pointer;
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 200px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const WalletButton = styled.button`
  height: 50px;
  border-radius: 10px;
  border: 2px solid #fff;
  background-color: transparent;
  padding: 10px 15px;
  font-weight: bold;
  color: var(--secondary-text);
  cursor: pointer;
  font-size: 28px;
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: #ff5101;
  padding: 10px;
  font-weight: bold;
  font-size: 24px;
  color: #fff;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ResponsiveWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 1920px;
  margin-top: 50px;
`;
export const ResponsiveHeader = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1720px;
  height: 60%;
  padding: 0 20px;
  margin-top: 50px;
`;

export const SloganImg = styled.img`
  width: 500px;
`;

export const SlideWrap = styled.div`
  display: flex;
  width: 40%;
  max-width: 500px;
  height: 100%;
  align-items: center;
  box-sizing: border-box;
`;

export const MintingWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 500px;
  padding: 44px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  margin-left: 20px;
`;

export const MintingImg = styled.img`
  position: absolute;
  top: -115px;
  right: 45px;
  width: 150px;
`;

export const MintingSubText = styled.div`
  color: #999;
  font-size: 16px;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  /* Custom */
  let wallet_state = "WALLET CONNECT";

  return (
    <s.Screen>
      <s.Container
        /* 전체 영역 */
        flex={1}
        ai={"center"}
        style={{ padding: 24, minWidth: 1000 }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <ResponsiveHeader>
          <a d={"block"} w={200} href={CONFIG.MARKETPLACE_LINK}>
            <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
          </a>

          <WalletButton
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
              getData();
            }}
          >
            {wallet_state}
          </WalletButton>
        </ResponsiveHeader>

        <SloganImg
          alt={"SAVING PLANET, PLOGGING CATS"}
          src={"/config/images/minting_slogan.png"}
        />

        <ResponsiveWrapper>
          <SlideWrap>
            <Slide />
          </SlideWrap>

          <MintingWrap>
            <MintingImg
              alt={"SAVING PLANET, PLOGGING CATS"}
              src={"/config/images/minting_cat.png"}
            />
            {/* 민팅 헤더 */}
            <s.Container flex={4} jc={"center"}>
              <s.TextTitle
                style={{
                  height: "43px",
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#ff5101",
                  borderBottom: "10px solid #f3ebcb",
                }}
              >
                오늘은 플로깅 캣츠 민팅 DAY!
              </s.TextTitle>
              <s.TextTitle
                style={{
                  height: "43px",
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                지금 바로, 민팅을 해보세요!
              </s.TextTitle>
              <s.TextDescription
                style={{
                  marginBottom: "20px",
                  color: "#666",
                }}
              >
                Today is PLOGGING CATS Minting Day! Right Now! Minting start!
              </s.TextDescription>
            </s.Container>

            {/* 민팅 Quantity & Price */}
            <s.Container
              flex={3}
              fd={"column"}
              jc={"center"}
              style={{
                marginBottom: "30px",
              }}
            >
              <s.Container
                fd={"row"}
                jc={"start"}
                ai={"space-between"}
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#000",
                  marginBottom: "10px",
                }}
              >
                <s.Container flex={2} ai={"center"} fd={"row"}>
                  Quantity & Price
                  <s.TextDescription
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginLeft: "5px",
                    }}
                  >
                    REMAINING QUANTITY
                  </s.TextDescription>
                </s.Container>
                <s.Container
                  flex={1}
                  fd={"row"}
                  jc={"end"}
                  ai={"center"}
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  <s.TextTitle
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: "#ff5101",
                    }}
                  >
                    {data.totalSupply}
                  </s.TextTitle>
                  &nbsp;/&nbsp;
                  <s.TextTitle
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: "#666",
                    }}
                  >
                    {CONFIG.MAX_SUPPLY}
                  </s.TextTitle>
                </s.Container>
              </s.Container>
              <s.Container>
                <ProgressBar
                  completed={data.totalSupply}
                  maxCompleted={CONFIG.MAX_SUPPLY}
                  bgColor="#ff5101"
                  isLabelVisible={false}
                  baseBgColor="#999"
                  className="minting_progress"
                />
              </s.Container>
            </s.Container>

            {/* 민팅 구매 수량 및 버튼 */}
            <s.Container
              flex={4}
              fd={"column"}
              jc={"start"}
              ai={"start"}
              style={{
                height: "43px",
                fontSize: 24,
                fontWeight: "bold",
                color: "#000",
              }}
            >
              <s.Container
                ai={"space-between"}
                fd={"row"}
                style={{ marginBottom: "20px" }}
              >
                <s.Container flex={3} ai={"center"} fd={"row"}>
                  민팅 구매 수량
                  <s.TextDescription
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginLeft: "5px",
                    }}
                  >
                    MINTING AMOUNT
                  </s.TextDescription>
                </s.Container>

                <s.Container
                  flex={1}
                  jc={"space-between"}
                  ai={"center"}
                  fd={"row"}
                >
                  <StyledRoundButton
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      decrementMintAmount();
                    }}
                  >
                    -
                  </StyledRoundButton>
                  {mintAmount}
                  <StyledRoundButton
                    disabled={claimingNft ? 1 : 0}
                    onClick={(e) => {
                      e.preventDefault();
                      incrementMintAmount();
                    }}
                  >
                    +
                  </StyledRoundButton>
                </s.Container>
              </s.Container>
              <s.Container
                jc={"start"}
                ai={"center"}
                fd={"row"}
                style={{
                  marginBottom: 15,
                }}
              >
                <s.TextDescription
                  style={{
                    fontSize: "12px",
                    color: "#000",
                  }}
                >
                  민팅은 새로고침 없이 진행됩니다.
                </s.TextDescription>
                <s.TextDescription
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    marginLeft: "5px",
                  }}
                >
                  Minting will proceed without refresh (F5)
                </s.TextDescription>
              </s.Container>
              <s.Container
                flex={1}
                jc={"center"}
                ai={"center"}
                fd={"row"}
                style={{
                  height: 30,
                  fontSize: 12,
                  color: "#f3ebcb",
                  backgroundColor: "#ff5101",
                  fontSize: 28,
                  fontWeight: "bold",
                  borderRadius: 15,
                }}
                disabled={claimingNft ? 1 : 0}
                onClick={(e) => {
                  e.preventDefault();
                  claimNFTs();
                  getData();
                }}
              >
                {claimingNft ? "BUYS" : "APPROVE"}
              </s.Container>
            </s.Container>
          </MintingWrap>
          {/* 
            <s.Container
              flex={3}
              jc={"center"}
              ai={"center"}
              style={{
                padding: 24,
                borderRadius: 50,
                overflow: "hidden",
              }}
            >
              <s.TextTitle
                style={{
                  textAlign: "center",
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                오늘은 플로깅 캣츠 민팅 DAY!<br />
                지금 바로, 민팅을 해보세요!
                {data.totalSupply} / {CONFIG.MAX_SUPPLY}
              </s.TextTitle>
              <s.TextDescription
                style={{
                  textAlign: "center",
                  color: "#666",
                }}
              >
                Today is PLOGGING CATS Minting Day! Right Now! Minting start!
                <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                  {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                </StyledLink>
              </s.TextDescription>
              <span
                style={{
                  textAlign: "center",
                }}
              >
                <StyledButton
                  onClick={(e) => {
                    window.open("/config/roadmap.pdf", "_blank");
                  }}
                  style={{
                    margin: "5px",
                  }}
                >
                  Roadmap
                </StyledButton>
                <StyledButton
                  style={{
                    margin: "5px",
                  }}
                  onClick={(e) => {
                    window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                  }}
                >
                  {CONFIG.MARKETPLACE}
                </StyledButton>
              </span>
              <s.SpacerSmall />
              {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                <>
                  <s.TextTitle
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    The sale has ended.
                  </s.TextTitle>
                  <s.TextDescription
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    You can still find {CONFIG.NFT_NAME} on
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </StyledLink>
                </>
              ) : (
                <>
                  <s.TextTitle
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                    {CONFIG.NETWORK.SYMBOL}.
                  </s.TextTitle>
                  <s.SpacerXSmall />

                  <s.TextDescription
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    Excluding gas fees.
                  </s.TextDescription>

                  <s.SpacerSmall />
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        Connect to the {CONFIG.NETWORK.NAME} network
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <StyledButton
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        CONNECT
                      </StyledButton>
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>
                  ) : (
                    <>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {feedback}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledRoundButton
                          style={{ lineHeight: 0.4 }}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount();
                          }}
                        >
                          -
                        </StyledRoundButton>
                        <s.SpacerMedium />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {mintAmount}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <StyledRoundButton
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount();
                          }}
                        >
                          +
                        </StyledRoundButton>
                      </s.Container>
                      <s.SpacerSmall />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledButton
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            claimNFTs();
                            getData();
                          }}
                        >
                          {claimingNft ? "BUSY" : "BUY"}
                        </StyledButton>
                      </s.Container>
                    </>
                  )}
                </>
              )}
            </s.Container>
            */}
        </ResponsiveWrapper>
      </s.Container>
    </s.Screen>
  );
}

export default App;
