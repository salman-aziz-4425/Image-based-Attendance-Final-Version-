import React from 'react';
import { VCardWidgetWrapper } from './vCardWidget.styles';

export default function VCardWidget(
  {
    src,
    alt,
    email,
    name,
    title,
    description,
    children,
    style,
  }
) {
  return (
    <VCardWidgetWrapper className="isoVCardWidgetWrapper" style={style}>
      <div className="isoVCardImage">
        <img src={src} alt={alt} />
      </div>

      <div className="isoVCardBody">
        <h3 className="isoName">{name}</h3>
        <span className="isoDesgTitle">{title}</span>
        <span className="isoDesgTitle">{email}</span>
        <p className="isoDescription">{description}</p>

        <div className="isoWidgetSocial">{children}</div>
      </div>
    </VCardWidgetWrapper>
  );
}
