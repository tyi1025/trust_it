import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { connect } from 'react-redux';
import UserFooter from './components/UserFooter';
import ComparisonBar from './components/ComparisonBar';

import { store, persistor } from './store';

import './scss/App.scss';

import { addProductToComp, removeProductFromComp } from './actions/product';

import UserHomePage from './pages/UserHomePage';
import BarcodeSearchPage from './pages/BarcodeSearchPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ScoreCalculatorPage from './pages/ScoreCalculatorPage';
import IngredientDetailsPage from './pages/IngredientDetailsPage';
import ResearchResultPage from './pages/ResearchResultPage';

import ManufacturerHomePage from './pages/ManufacturerHomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import CheckoutPage from './pages/CheckoutPage';
import InvoicePage from './pages/InvoicePage';
import EditProductPage from './pages/EditProductPage';
import PurchasePackagePage from './pages/PurchasePackagePage';
import StartTrialPage from './pages/StartTrialPage';
import PurchasePage from './pages/PurchasePage';
import AboutUsPage from './pages/AboutUsPage';
import ManufacturerHelpPage from './pages/ManufacturerHelpPage';
import UserHelpPage from './pages/UserHelpPage';
import MyPlanPage from './pages/MyPlanPage';
import ComparisonPage from './pages/ComparisonPage';
import MessageBox from './components/MessageBox';
import { hideMessage } from './actions/checkout';

const mapStateToProps = function(state) {
  return {
    productCompList: state.product.productCompList,
    footerHidden: state.userInterface.footerHidden,
    alertMessageHidden: state.userInterface.alertMessageHidden,
    alertMessage: state.userInterface.alertMessage
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addProductToComp: (product) => {
      dispatch(addProductToComp(product));
    },
    removeProductFromComp: (product) => {
      dispatch(removeProductFromComp(product));
    },
    hideMessage: () => {
      dispatch(hideMessage());
    }
  };
};

const ConnectApp = connect (
  mapStateToProps,
  mapDispatchToProps
) (function (props) {
  const location = useLocation();

  const {
    productCompList, removeProductFromComp, footerHidden, alertMessageHidden, alertMessage, hideMessage
  } = props;

  useEffect(() => {
    if(alertMessage != '') {
      setTimeout(() => {
        hideMessage();
      }, 3000);
    }
  }, [alertMessage]);

  return (
    <React.Fragment>
      <div className="app">
        <Routes>
          <Route path="/">
            <Route path="" element={<UserHomePage />} />
            <Route path="search" element={<ResearchResultPage />} />
            <Route path="barcode" element={<BarcodeSearchPage />} />
            <Route path="product/:productId" element={<ProductDetailsPage />} />
            <Route path="calculator" element={<ScoreCalculatorPage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="help" element={<UserHelpPage />} />
            <Route path="ingredient/:ingredientId" element={<IngredientDetailsPage />} />
            <Route path="barcode" element={<BarcodeSearchPage />} />
            <Route path="comparison" element={<ComparisonPage />} />
          </Route>
          <Route path="portal">
            <Route path="" element={<ManufacturerHomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="my_plan" element={<MyPlanPage />} />
            <Route path="registration" element={<RegistrationPage />} />
            <Route path="edit_product/:productId" element={<EditProductPage />} />
            <Route path="add_product/" element={<EditProductPage />} />
            <Route path="new_product/" element={<EditProductPage />} />
            <Route path="purchase" element={<PurchasePage />} />
            <Route path="trial" element={<StartTrialPage />} />
            <Route path="packages" element={<PurchasePackagePage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="invoice/:invoiceId" element={<InvoicePage />} />
            <Route path="help" element={<ManufacturerHelpPage />} />
          </Route>
        </Routes>
      </div>
      {(productCompList.length !== 0 && location.pathname !== '/comparison') &&
        <ComparisonBar
          removeProductFromComp={removeProductFromComp}
          productCompList={productCompList} />}
      <MessageBox active={!alertMessageHidden} message = {alertMessage}/>
      {!footerHidden && <UserFooter />}
    </React.Fragment>
  );
});

function App() {
  return (
    <Router>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConnectApp />
        </PersistGate>
      </Provider>
    </Router>
  );
}

export default App;
