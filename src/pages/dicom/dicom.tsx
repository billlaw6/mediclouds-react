import React, { FC } from 'react';
import { createContext } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link, RouteComponentProps } from 'react-router-dom';
import { DicomInfoSearchForm, ResizableTitle, DicomInfoTable } from './components/DicomManage';
import { IDicomInfo, IDicomSearchState, IStoreState, } from '../../constants/interface';
import {
    dicomSearchRequstedAction,
    dicomSearchSucceededAction,
    dicomSearchFailedAction,
} from '../../store/actions/dicom';
import { Table, Input, Button, Icon } from 'antd';
import DicomViewer from './components/DicomViewer';
import DicomUploader from './components/DicomUploader';
import RouteWithSubRoutes from '../../components/RouteWithSubRoutes';


declare interface IProps {
    routes?: Array<any>;
    // mapStateToProps中的字段不需要在这声明
    // pathname: string;
    // search: string;
}

const mapStateToProps = (state: IStoreState) => ({
    pathname: state.router.location.pathname,
    search: state.router.location.search,
})

class Dicom extends React.Component<IProps, object> {
    constructor(props: IProps) {
        super(props);
        console.log(props);
    }

    render() {
        return (
            <>
                <ul>
                    <li>
                        <Link to="/dicom/viewer">viewer</Link>
                    </li>
                    <li>
                        <Link to="/dicom/uploader">uploader</Link>
                    </li>
                </ul>
                <Switch>
                    {/* {this.props.routes!.map((item, index) => {
                        return <Route
                            key={index}
                            exact={true}
                            path={item.path}
                            render={(props) => {
                                return <item.component routes={item.routes} />
                            }}
                        />
                    })} */}
                    <Route path="/dicom/viewer" component={DicomViewer} />
                    <Route path="/dicom/uploader" component={DicomUploader} />
                    {/* {this.props.routes!.map((item: any, index: number) => {
                        return <RouteWithSubRoutes key={index} {...item} />
                    })} */}
                </Switch>
            </>
        )
    }
}

export default connect(mapStateToProps)(Dicom);
// export default Dicom;