import * as _ from "lodash";

const getInitialsFromName = (name: string) => {
  const parts = _.split(_.trim(name), " ");

  if (_.size(parts) === 1) {
    return _.toUpper(_.first(parts).charAt(0));
  }

  return `${_.toUpper(_.first(parts).charAt(0))}${_.toUpper(
    _.last(parts).charAt(0)
  )}`;
};

export { getInitialsFromName };
