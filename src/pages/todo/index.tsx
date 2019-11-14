import React, { ChangeEventHandler } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { editDraftAction } from '../../actions/draft';
// import { IStoreState } from '../../constants/store.d';
import { IDraftState } from '../../constants/store';
// import { IState } from '../../reducers/';
import { IStoreState } from '../../constants/store'

// 从root级storeState中摘出本组件需要的部分
const mapStateToProps = (state: IStoreState) => {
    // Property 'draft' does not exist on type 'Reducer<{ draft: IDraftState; router: RouterState; }, AnyAction>'.  TS2339
    // console.log(state.draft);
    return {
        draft: state.draft,
    };
};
// 根据摘选部分约束本组件state类型
type IStateProps = ReturnType<typeof mapStateToProps>;

// 将本组件可接收的Action转成Props传入
const mapDispatchToProps = {
    editDraftAction,
};
// 根据对象生成类型约束
type IDispatchProps = typeof mapDispatchToProps;

// 使用交叉类型
type IProps = RouteComponentProps<any> & IStateProps & IDispatchProps;

class Edit extends React.Component<IProps, {}>{
    constructor(props: IProps) {
        super(props);
        console.log(this.props);
        this.state = { key: 'alsdk'}
    }

    onCheckboxValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        console.log(this.props.draft);
        this.props.editDraftAction({
            ...this.props,
            isChecked: e.target.checked,
            content: 'new action',
        });
    };

    onContentValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        this.setState({key: 'newValue'});
        this.props.editDraftAction({
            ...this.props,
            isChecked: true,
            content: e.target.value,
        });
    };

    onSave = () => {
        // debugger;
        console.log(this.props.draft.content);
    };

    render() {
        return (
            <div className="edit">
                <div>
                    <input
                        type="checkbox"
                        checked={this.props.draft.isChecked}
                        onChange={this.onCheckboxValueChange}
                    />
                    <input
                        type="text"
                        value={this.props.draft.content}
                        onChange={this.onContentValueChange}
                    />
                </div>
                {}
                <div>
                    <button>取消</button>
                    <button onClick={this.onSave}>确定</button>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Edit);