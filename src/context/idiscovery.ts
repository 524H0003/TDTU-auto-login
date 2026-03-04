import { execute } from ".";

execute({
  usernameField: "",
  passwordField: "",
  url: () => "",
  conditionFunc() {
    const xhr = new XMLHttpRequest();

    try {
      const jwt = sessionStorage.getItem("primoExploreJwt");

      xhr.open(
        "GET",
        // eslint-disable-next-line max-len
        "http://idiscovery.tdtu.edu.vn/primo_library/libweb/webservices/rest/v1/usersettings?vid=tdtu",
        false,
      );

      xhr.setRequestHeader("authorization", `Bearer ${jwt}`);

      xhr.send("vid=tdtu");

      if (xhr.status === 200) {
        console.log("hook");
        if (JSON.parse(xhr.responseText)["email"] == "") {
          const hostUrl = "https://elink.tdtu.edu.vn:8443/cas/login",
            url = new URL(hostUrl);

          url.searchParams.append(
            "service",
            // eslint-disable-next-line max-len
            "http://catalog.tdtu.edu.vn/cas/pds_main?func=load-login&calling_system=primo&institute=TDT50&PDS_HANDLE=&url=http://idiscovery.tdtu.edu.vn:80/primo_library/libweb/pdsLogin?targetURL=http%3A%2F%2Fidiscovery%2Etdtu%2Eedu%2Evn%2Fprimo-explore%2Fsearch%3Fvid%3Dtdtu&from-new-ui=1&authenticationProfile=TDT&filler=",
          );

          window.location.href = url.toString();
        }
      }
    } catch {
      /* empty */
    }

    return false;
  },
});

export const runOnUpdate = true;
