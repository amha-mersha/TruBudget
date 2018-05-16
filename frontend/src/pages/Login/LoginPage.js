import React from "react";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import SettingsIcon from "@material-ui/icons/Settings";
import Typography from "@material-ui/core/Typography";

import { ACMECorpLightgreen } from "../../colors";

import Username from "../Common/Username";
import Password from "../Common/Password";
import strings from "../../localizeStrings";
import Dropdown from "../Common/NewDropdown";

//import { isAdminNode } from '../../helper';

const LoginPage = ({
  history,
  nodePermissions,
  storeUsername,
  storePassword,
  username,
  password,
  loginWithCredentails,
  loginUnsuccessful,
  environment,
  storeEnvironment,
  language,
  setLanguage
}) => {
  //const connectedToAdminNode = isAdminNode(nodePermissions);
  const connectedToAdminNode = -1;
  return (
    <div
      style={{
        backgroundImage: 'url("/welcome.jpg")',
        backgroundSize: "cover",
        width: "100%",
        height: "100vh",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <Card style={{ width: "350px", zIndex: 1100, opacity: 0.9 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CardHeader title="TruBudget" subheader={strings.login.tru_budget_description} />
          <div style={{ width: "40%", marginRight: "8px" }}>
            <Dropdown
              onChange={storeEnvironment}
              floatingLabel={strings.login.environment}
              value={environment}
              floatingLabelStyle={{ color: ACMECorpLightgreen }}
              id="environment_selection"
            >
              <MenuItem value="Test">{strings.login.test_env}</MenuItem>
              <MenuItem value="Prod">{strings.login.production_env}</MenuItem>
            </Dropdown>
          </div>
        </div>
        <Divider />
        <Username username={username} storeUsername={storeUsername} loginFailed={loginUnsuccessful} />
        <Password
          password={password}
          storePassword={storePassword}
          loginFailed={loginUnsuccessful}
          nextBestAction={() => loginWithCredentails(username, password)}
        />
        <div
          style={{
            paddingTop: "10px",
            paddingBottom: "20px",
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Dropdown value={language} id="language_selection" onChange={setLanguage} style={{ marginLeft: "10px" }}>
            <MenuItem value="en-gb">{strings.language.english}</MenuItem>
            <MenuItem value="fr">{strings.language.french}</MenuItem>
            <MenuItem value="pt">{strings.language.portuguese}</MenuItem>
            <MenuItem value="de">{strings.language.german}</MenuItem>
          </Dropdown>
          <Button
            aria-label="loginbutton"
            style={{ marginRight: 20, marginTop: 5 }}
            onClick={() => loginWithCredentails(username, password)}
            variant="raised"
          >
            {strings.login.login_button_title}
          </Button>
        </div>
        <Divider />
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <CardContent style={{ fontSize: "11px" }}>
            <Typography variant="caption">{strings.login.accenture_tag}</Typography>
          </CardContent>
          <IconButton disabled={!(connectedToAdminNode > -1)} onClick={() => history.push("/admin")}>
            <SettingsIcon />
          </IconButton>
        </div>
      </Card>
      <img style={{ marginTop: "40px", width: "200px" }} alt="Logo" src="/do_logo.png" />
    </div>
  );
};

export default LoginPage;
