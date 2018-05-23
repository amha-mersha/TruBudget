import React, { Component } from "react";
import { connect } from "react-redux";

import globalStyles from "../../styles";

import {
  fetchWorkflowItems,
  setCurrentStep,
  showWorkflowDialog,
  storeWorkflowComment,
  storeWorkflowCurrency,
  storeWorkflowAmount,
  storeWorkflowAmountType,
  storeWorkflowName,
  createWorkflowItem,
  editWorkflowItem,
  storeWorkflowTxid,
  showWorkflowDetails,
  updateWorkflowSortOnState,
  enableWorkflowSort,
  storeWorkflowType,
  postWorkflowSort,
  enableSubProjectBudgetEdit,
  storeSubProjectAmount,
  postSubProjectEdit,
  isWorkflowApprovalRequired,
  fetchAllSubprojectDetails,
  onWorkflowDialogCancel,
  storeWorkflowStatus,
  showSubProjectPermissions,
  showWorkflowItemPermissions,
  closeWorkflowItem,
  showWorkflowItemAssignee,
  showSubProjectAssignee,
  fetchSubprojectHistory
} from "./actions";

import { setSelectedView } from "../Navbar/actions";
import { showHistory, fetchHistoryItems } from "../Notifications/actions";
import { addDocument, clearDocuments, prefillDocuments, validateDocument } from "../Documents/actions";
import Workflow from "./Workflow";
import SubProjectDetails from "./SubProjectDetails";
import { canViewSubProjectPermissions, canAssignSubProject } from "../../permissions";
import { toJS } from "../../helper";
import SubprojectPermissionsContainer from "./SubprojectPermissionsContainer";
import WorkflowItemPermissionsContainer from "./WorkflowItemPermissionsContainer";
import strings from "../../localizeStrings";
import SubProjectHistoryContainer from "./SubProjectHistoryContainer";
import { fetchUser } from "../Login/actions";

class WorkflowContainer extends Component {
  constructor(props) {
    super(props);
    const path = props.location.pathname.split("/");
    this.projectId = path[2];
    this.subProjectId = path[3];
  }

  componentWillMount() {
    this.props.setSelectedView(this.subProjectId, "subProject");
    this.props.fetchAllSubprojectDetails(this.projectId, this.subProjectId, true);
    this.props.fetchUser();
  }

  componentWillUnmount() {
    this.props.hideWorkflowDetails();
    this.props.onWorkflowDialogCancel();
  }

  createWorkflowItem = (workflow, documents) => {
    this.props.createWorkflowItem(this.projectId, this.subProjectId, workflow, documents);
  };

  closeWorkflowItem = wId => this.props.closeWorkflowItem(this.projectId, this.subProjectId, wId);

  render() {
    const canViewPermissions = canViewSubProjectPermissions(this.props.allowedIntents);
    const canAssinSubproject = canAssignSubProject(this.props.allowedIntents);
    return (
      <div>
        <div style={globalStyles.innerContainer}>
          <SubProjectDetails
            {...this.props}
            canViewPermissions={canViewPermissions}
            canAssinSubproject={canAssinSubproject}
          />
          <SubprojectPermissionsContainer
            projectId={this.projectId}
            subProjectId={this.subProjectId}
            title={strings.subproject.subproject_permissions_title}
          />
          <WorkflowItemPermissionsContainer
            projectId={this.projectId}
            subProjectId={this.subProjectId}
            title={strings.workflow.workflow_permissions_title}
          />
          <Workflow
            {...this.props}
            createWorkflowItem={this.createWorkflowItem}
            closeWorkflowItem={this.closeWorkflowItem}
          />
          <SubProjectHistoryContainer />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchAllSubprojectDetails: (pId, sId, loading) => dispatch(fetchAllSubprojectDetails(pId, sId, loading)),
    fetchSubprojectHistory: (pId, sId, loading) => dispatch(fetchSubprojectHistory(pId, sId, loading)),
    openWorkflowDialog: editMode => dispatch(showWorkflowDialog(editMode)),
    onWorkflowDialogCancel: () => dispatch(onWorkflowDialogCancel(false)),
    storeWorkflowComment: comment => dispatch(storeWorkflowComment(comment)),
    storeWorkflowCurrency: currency => dispatch(storeWorkflowCurrency(currency)),
    storeWorkflowAmount: amount => dispatch(storeWorkflowAmount(amount)),
    storeWorkflowAmountType: type => dispatch(storeWorkflowAmountType(type)),
    storeWorkflowName: name => dispatch(storeWorkflowName(name)),
    storeWorkflowStatus: state => dispatch(storeWorkflowStatus(state)),
    storeWorkflowTxid: txid => dispatch(storeWorkflowTxid(txid)),
    createWorkflowItem: (pId, sId, workflowToAdd, documents) =>
      dispatch(createWorkflowItem(pId, sId, workflowToAdd, documents)),
    showSubProjectPermissions: () => dispatch(showSubProjectPermissions()),
    showSubProjectAssignee: () => dispatch(showSubProjectAssignee()),
    showWorkflowItemPermissions: wId => dispatch(showWorkflowItemPermissions(wId)),
    openHistory: () => dispatch(showHistory()),
    openWorkflowDetails: txid => dispatch(showWorkflowDetails(true, txid)),
    hideWorkflowDetails: () => dispatch(showWorkflowDetails(false)),
    closeWorkflowItem: (pId, sId, wId) => dispatch(closeWorkflowItem(pId, sId, wId, true)),
    showWorkflowItemAssignee: (workflowId, assignee) => dispatch(showWorkflowItemAssignee(workflowId, assignee)),
    fetchWorkflowItems: streamName => dispatch(fetchWorkflowItems(streamName)),
    editWorkflowItem: (stream, key, workflowToAdd, documents, previousState) =>
      dispatch(editWorkflowItem(stream, key, workflowToAdd, documents, previousState)),
    fetchHistoryItems: subProjectName => dispatch(fetchHistoryItems(subProjectName)),
    setSelectedView: (id, section) => dispatch(setSelectedView(id, section)),
    setCurrentStep: step => dispatch(setCurrentStep(step)),
    updateWorkflowSortOnState: items => dispatch(updateWorkflowSortOnState(items)),
    enableWorkflowSort: () => dispatch(enableWorkflowSort(true)),
    postWorkflowSort: (streamName, workflowItems) => dispatch(postWorkflowSort(streamName, workflowItems)),
    storeWorkflowType: value => dispatch(storeWorkflowType(value)),
    enableBudgetEdit: () => dispatch(enableSubProjectBudgetEdit(true)),
    disableBudgetEdit: () => dispatch(enableSubProjectBudgetEdit(false)),
    storeSubProjectAmount: amount => dispatch(storeSubProjectAmount(amount)),
    postSubProjectEdit: (parent, streamName, status, amount) =>
      dispatch(postSubProjectEdit(parent, streamName, status, amount)),
    addDocument: (payload, name, id) => dispatch(addDocument(payload, name, id)),
    clearDocuments: () => dispatch(clearDocuments()),
    validateDocument: (payload, hash) => dispatch(validateDocument(payload, hash)),
    prefillDocuments: documents => dispatch(prefillDocuments(documents)),
    fetchUser: () => dispatch(fetchUser(true)),
    isWorkflowApprovalRequired: approvalRequired => dispatch(isWorkflowApprovalRequired(approvalRequired))
  };
};

const mapStateToProps = state => {
  return {
    id: state.getIn(["workflow", "id"]),
    displayName: state.getIn(["workflow", "displayName"]),
    description: state.getIn(["workflow", "description"]),
    status: state.getIn(["workflow", "status"]),
    amount: state.getIn(["workflow", "amount"]),
    currency: state.getIn(["workflow", "currency"]),
    assignee: state.getIn(["workflow", "assignee"]),
    created: state.getIn(["workflow", "created"]),
    allowedIntents: state.getIn(["workflow", "allowedIntents"]),
    workflowItems: state.getIn(["workflow", "workflowItems"]),
    parentProject: state.getIn(["workflow", "parentProject"]),
    subProjectDetails: state.getIn(["workflow", "subProjectDetails"]),
    workflowDialogVisible: state.getIn(["workflow", "workflowDialogVisible"]),
    workflowToAdd: state.getIn(["workflow", "workflowToAdd"]),
    workflowState: state.getIn(["workflow", "workflowState"]),
    editMode: state.getIn(["workflow", "editMode"]),
    currentStep: state.getIn(["workflow", "currentStep"]),
    showWorkflowDetails: state.getIn(["workflow", "showDetails"]),
    showDetailsItemId: state.getIn(["workflow", "showDetailsItemId"]),
    showHistory: state.getIn(["notifications", "showHistory"]),
    historyItems: state.getIn(["workflow", "historyItems"]),
    subProjects: state.getIn(["detailview", "subProjects"]),
    workflowSortEnabled: state.getIn(["workflow", "workflowSortEnabled"]),
    budgetEditEnabled: state.getIn(["workflow", "subProjectBudgetEditEnabled"]),
    subProjectAmount: state.getIn(["workflow", "subProjectAmount"]),
    workflowDocuments: state.getIn(["documents", "tempDocuments"]),
    validatedDocuments: state.getIn(["documents", "validatedDocuments"]),
    users: state.getIn(["login", "user"])
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(toJS(WorkflowContainer));
