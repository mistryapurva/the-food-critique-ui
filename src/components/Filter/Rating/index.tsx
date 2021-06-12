import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import React, { ChangeEvent, useState } from "react";
import { RatingFilterEnum } from "../../../types";

interface RatingFilterProps {
  onChange: (value: RatingFilterEnum) => void;
}

const RatingFilter = (props: RatingFilterProps) => {
  const [value, setValue] = useState("ALL");

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    props.onChange(e.target.value as RatingFilterEnum);
  };

  return (
    <FormControl>
      <InputLabel id="filter-rating-label" shrink>
        {"Rating"}
      </InputLabel>
      <Select
        labelId={"filter-rating-label"}
        label={"Rating"}
        value={value}
        onChange={handleChange}
        style={{ minWidth: 150 }}
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
      >
        <MenuItem value={"ALL"}>{"ALL"}</MenuItem>
        <MenuItem value={5}>
          <Rating readOnly value={5} />
        </MenuItem>
        <MenuItem value={4}>
          <Rating readOnly value={4} /> &nbsp; & up
        </MenuItem>
        <MenuItem value={3}>
          <Rating readOnly value={3} /> &nbsp; & up
        </MenuItem>
        <MenuItem value={2}>
          <Rating readOnly value={2} /> &nbsp; & up
        </MenuItem>
        <MenuItem value={1}>
          <Rating readOnly value={1} /> &nbsp; & up
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default RatingFilter;
