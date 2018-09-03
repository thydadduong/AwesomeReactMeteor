import { Meteor } from "meteor/meteor";
import React from "react";
import { render } from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import Homepage from "../imports/ui/components/homepage/Homepage";
Meteor.startup(() => {
    render(<Homepage />, document.getElementById("app"));
});
