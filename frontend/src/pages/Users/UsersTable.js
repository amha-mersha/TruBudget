import React from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import blueGrey from "@material-ui/core/colors/blueGrey";

const UsersTable = ({ users }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Organization</TableCell>
          <TableCell>Id</TableCell>
          <TableCell>Display name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map(user => {
          return (
            <TableRow key={user.id}>
              <TableCell component="th" scope="row">
                {user.organization}
              </TableCell>
              <TableCell> {user.id} </TableCell>
              <TableCell> {user.displayName}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
export default UsersTable;
