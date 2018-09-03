import React, { Component } from "react";
import { contacts } from "../../../api/contacts";
import { withTracker } from "meteor/react-meteor-data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faBan } from "@fortawesome/free-solid-svg-icons";

class Homepage extends Component {
    constructor() {
        super();
        this.state = {
            user: {
                userName: "",
                email: ""
            }
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange = e => {
        this.setState({
            ...this.state,
            user: { ...this.state.user, [e.target.name]: e.target.value }
        });
    };

    onSubmit = e => {
        e.preventDefault();
        const { user } = this.state;
        if (user.userName !== "" && user.email !== "") {
            contacts.insert({ ...user, createdAt: new Date() }, (err, done) => {
                console.log(err + " id = " + done);
            });
            this.setState({
                ...this.state,
                user: { userName: "", email: "" }
            });
        }
    };

    delete = contact => {
        const confirmed = confirm(
            `This contact:\n Name: ${contact.userName} \n Email: ${
                contact.email
            } \n Are you sure to delete it?`
        );

        if (confirmed) contacts.remove(contact._id);
    };

    ban = contact => {
        const confirmed = confirm(
            `This contact:\n Name: ${contact.userName} \n Email: ${
                contact.email
            } \n Are you sure to ${
                contact.banned ? "unban" : "ban"
            } this contact?`
        );

        if (confirmed)
            contacts.update(contact._id, {
                $set: { banned: !!!contact.banned }
            });
    };

    render() {
        // const { contacts } = this.state;
        return (
            <div className="container ">
                <div className="card mt-4">
                    <div className="card-body">
                        <h1>here is home page.</h1>
                        <hr />
                        <form onSubmit={this.onSubmit}>
                            <div className="form-row">
                                <div className="col">
                                    <input
                                        name="userName"
                                        type="text"
                                        className="form-control"
                                        placeholder="Username"
                                        onChange={this.onChange}
                                        value={this.state.user.userName}
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        name="email"
                                        type="text"
                                        className="form-control"
                                        placeholder="Email"
                                        onChange={this.onChange}
                                        value={this.state.user.email}
                                    />
                                </div>
                                <div className="col">
                                    <button className="btn btn-primary form-control text-uppercase">
                                        submit
                                    </button>
                                </div>
                            </div>
                        </form>
                        <table className="table table-striped mt-3">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Username</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Action</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.contacts.map((contact, id) => {
                                    return (
                                        <tr key={id + 1}>
                                            <th scope="row">{id + 1}</th>
                                            <td>
                                                {contact.userName ||
                                                    contact.user.userName}
                                            </td>
                                            <td>
                                                {contact.email ||
                                                    contact.user.email}
                                            </td>
                                            <td>
                                                <button
                                                    className={`btn ${
                                                        contact.banned
                                                            ? "btn-success"
                                                            : "btn-warning"
                                                    }`}
                                                    onClick={() =>
                                                        this.ban(contact)
                                                    }
                                                >
                                                    <FontAwesomeIcon icon="ban" />
                                                </button>

                                                <button
                                                    className="btn btn-danger ml-1"
                                                    onClick={() =>
                                                        this.delete(contact)
                                                    }
                                                >
                                                    <FontAwesomeIcon icon="trash" />
                                                </button>
                                            </td>
                                            <td>
                                                <span
                                                    class={`badge badge-${
                                                        contact.banned
                                                            ? "warning"
                                                            : "success"
                                                    }`}
                                                >
                                                    {contact.banned
                                                        ? "banned"
                                                        : "normal"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
library.add(faTrash, faBan);

export default withTracker(() => {
    return {
        contacts: contacts
            .find({}, { sort: { banned: 1, userName: 1 } })
            .fetch()
    };
})(Homepage);
