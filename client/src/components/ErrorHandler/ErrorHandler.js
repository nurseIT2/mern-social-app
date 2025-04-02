import React, { Fragment } from 'react';

import Backdrop from '../Backdrop/Backdrop';
import Modal from '../Modal/Modal';
import './ErrorHandler.css';

const errorHandler = props => (
  <Fragment>
    {props.error && <Backdrop onClick={props.onHandle} />}
    {props.error && (
      <Modal
        title="Произошла ошибка"
        onCancelModal={props.onHandle}
        onAcceptModal={props.onHandle}
        acceptEnabled
      >
        <div className="error-modal">
          <h2 className="error-modal__title">Ошибка</h2>
          <p className="error-modal__message">{props.error.message}</p>
          <button className="error-modal__button" onClick={props.onHandle}>
            Закрыть
          </button>
        </div>
      </Modal>
    )}
  </Fragment>
);

export default errorHandler;
