import React from 'react';

const Tooltip = (props) => {
  if (props.data) {
    const { year, month, variance } = props.data;
    const { tooltipX, tooltipY } = props;
    const baseTemperature = 8.66;
    const months = ["January", "February", "march", "April", "May", "Jun", "July", "August", "September", "October", "November", "December"];
    let monthWord = months[month - 1];
    const colorScale = props.colorScale;
    const color = colorScale(variance);

    const show = props.showTooltip ? "show" : "hide";

    const tooltipStyles = {
      borderColor: color,
      left: tooltipX - 2,
      top: tooltipY - 70
    };

    return (
      <div className={`tooltip ${show}`} style={tooltipStyles}>
        <div className="date">
          {`${monthWord} ${year}`}
        </div>
        <div className="temp">{(baseTemperature + variance).toFixed(2)}</div>
        <div className="diff">{`${variance >= 0 ? "+" : ""}${variance.toFixed(2)}`}</div>
      </div>
    );

  } else {
    return <div className="tooltip hide"></div>;
  }
};

export default Tooltip;