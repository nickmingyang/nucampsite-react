import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Label,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";
import { Loading } from "./LoadingComponent";
import { baseUrl } from "../shared/baseUrl";
import { FadeTransform, Fade, Stagger, Loop } from "react-animation-components";

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

function RenderCampsite({ campsite }) {
  return (
    <div className="col-md-5 m-1">
      <FadeTransform
        in
        transformProps={{
          exitTransform: "scale(0.5) translateY(-50%)",
        }}
      >
        <Card>
          <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
          <CardBody>
            <CardText>{campsite.description}</CardText>
          </CardBody>
        </Card>
      </FadeTransform>
    </div>
  );
}

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      touched: {
        author: false,
      },
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }
  handleSubmit(values) {
    this.toggleModal();
    this.props.postComment(
      this.props.campsiteId,
      values.rating,
      values.author,
      values.text
    );
  }
  render() {
    return (
      <React.Fragment>
        <div>
          <Button outline onClick={this.toggleModal}>
            <i className="fa fa-pencil fa-lg" /> Submit Comment
          </Button>
        </div>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <div className="form-group">
                <div className="form-check">
                  <Label htmlFor="rating">Rating</Label>
                </div>

                <Col>
                  <Control.select
                    model=".rating"
                    name="rating"
                    className="form-control"
                  >
                    <option>Please Select</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                </Col>
              </div>
              <div className="form-group">
                <div className="form-check">
                  <Label htmlFor="author">Your Name</Label>
                </div>
                <Col>
                  <Control.text
                    model=".author"
                    className="form-control"
                    id="author"
                    name="author"
                    placeholder="Your Name"
                    validators={{
                      required,
                      minLength: minLength(2),
                      maxLength: maxLength(15),
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".author"
                    show="touched"
                    component="div"
                    messages={{
                      required: "Required",
                      minLength: "Must be at least 2 characters",
                      maxLength: "Must be 15 characters or less",
                    }}
                  />
                </Col>
              </div>
              <div className="form-group">
                <div className="form-check">
                  <Label htmlFor="text">Comment</Label>
                </div>
                <Col>
                  <Control.textarea
                    model=".text"
                    className="form-control"
                    id="text"
                    name="text"
                    rows="6"
                  />
                </Col>
              </div>
              <div className="form-group">
                <Col>
                  <Button type="submit" color="primary">
                    Submit
                  </Button>
                </Col>
              </div>
            </LocalForm>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

function RenderComments({ comments, postComment, campsiteId }) {
  if (comments) {
    return (
      <div className="col-md-5 m-1">
        <h4>Comments</h4>
        <Stagger in>
          {comments.map((comment) => (
            <Fade in key={comment.id}>
              <div>
                <li>{comment.text}</li>
                <li>
                  -- {comment.author}{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(Date.parse(comment.date)))}
                </li>
                <p> </p>
              </div>
            </Fade>
          ))}
        </Stagger>
        <CommentForm campsiteId={campsiteId} postComment={postComment} />
      </div>
    );
  }
  return <div></div>;
}

function CampsiteInfo(props) {
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  }
  if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h4>{props.errMess}</h4>
          </div>
        </div>
      </div>
    );
  }
  if (props.campsite) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/directory">Directory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
            </Breadcrumb>
            <Loop in iterations={10}>
              <Fade>
              <h2>{props.campsite.name}</h2>
              </Fade>
            </Loop>
            
            <hr />
          </div>
        </div>
        <div className="row">
          <RenderCampsite campsite={props.campsite} />
          <RenderComments
            comments={props.comments}
            postComment={props.postComment}
            campsiteId={props.campsite.id}
          />
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default CampsiteInfo;
