import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import qs from "qs";
import { weChatLoginUser } from "../../services/user";

class OauthAffiliate extends React.Component<any, { registered: boolean }> {
  constructor(props: any) {
    super(props);

    this.state = {
      registered: false,
    };
  }
  componentDidMount(): void {
    const query = this.props.router.location.search.substr(1);
    const obj = qs.parse(query);

    if (obj.code) {
      weChatLoginUser(obj)
        .then((res) => {
          console.log("res", res);
          this.setState({ registered: true });
        })
        .catch((error) => console.error(error));
    } else {
      console.log("no code");
    }
  }

  render(): ReactElement {
    const { registered } = this.state;

    return (
      <div className="login-redirect">
        {registered ? (
          <span>正在注册...</span>
        ) : (
          <span>
            注册成功，<Link to="/login-affiliate">点击返回注册页</Link>
          </span>
        )}
      </div>
    );
  }
}

export default OauthAffiliate;
