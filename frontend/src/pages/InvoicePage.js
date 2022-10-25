import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { getInvoice } from '../actions/invoice';
import { showFooter, hideFooter } from '../actions/interface';
import Loading from '../components/Loading';
import '../scss/InvoicePage.scss';

const InvoicePage = function(props) {
  const {
    invoice, getInvoiceLoading, getInvoiceError, getInvoice,
    showFooter, hideFooter
  } = props;
  const { invoiceId } = useParams();

  useEffect(() => {
    getInvoice(invoiceId);
  },[getInvoice, invoiceId]);

  useEffect(() => {
    hideFooter();
    return () => {
      showFooter();
    };
  }, []);

  const navigate = useNavigate();

  if (getInvoiceError) {
    return (
      <div>Error getting invoice</div>
    );
  }

  const goBack = () => {
    navigate('/portal/');
  };

  return (
    <div className='invoice-page'>
      <div className='page-box'>
        <h1>Payment successful</h1>
        <div>
          <div className='page container-fluid'>
            <div className='row'>
              <div className='col'>Manufacturer Name</div>
              <div className='col'>{invoice?.manufacturer.name}</div>
            </div>
            <div className='row'>
              <div className='col'>Date</div>
              <div className='col'>{invoice?.createdAt.slice(0, 10)}</div>
            </div>
            <div className='row'>
              <div className='col'>Amount</div>
              <div className='col'>{invoice?.paymentIntent.amount / 100}</div>
            </div>
            <div className='row'>
              <div className='col'>Currency</div>
              <div className='col'>{invoice?.paymentIntent.currency}</div>
            </div>
          </div>
        </div>
        <button onClick={() => goBack()}>Return</button>
      </div>
      {getInvoiceLoading && <Loading />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    invoice: state.invoice.invoice,
    getInvoiceLoading: state.invoice.invoiceLoading,
    getInvoiceError: state.invoice.invoiceError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getInvoice: (invoiceId) => {
      dispatch(getInvoice(invoiceId));
    },
    showFooter: () => {
      dispatch(showFooter());
    },
    hideFooter: () => {
      dispatch(hideFooter());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvoicePage);
