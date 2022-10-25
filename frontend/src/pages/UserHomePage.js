import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import { getCategoryTree } from '../actions/category';
import { getProductsInCategoryList } from '../actions/productsInCategory';
import { addProductToComp } from '../actions/product';

import UserHeader from '../connectedComponents/UserHeader';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

import '../scss/UserHomePage.scss';

const UserHomePage = (props) => {
  const navigate = useNavigate();
  const {
    getCategoryTree, categoryTree,
    getProductsInCategoryList, productsInCategoryList, addProductToComp,
    categoryTreeLoading, productsIncategoryListLoading
  } = props;

  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    getCategoryTree();
    getProductsInCategoryList();
  }, []);

  function renderCategoryTree(categories, level) {
    return (
      <div className={['category-container', 'level-' + level].join(' ')}>
        {categories.map((category) => {
          return (
            <div
              className="category-inner-container"
              key={'category_' + category._id}>
              <Link to={'/search?category=' + category._id}>
                {category.name}
              </Link>
              <div className="category-children">
                {
                  category.children && category.children.length > 0 &&
                    renderCategoryTree(category.children, level + 1)
                }
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <UserHeader />
      <div className='homepage user'>
        <div
          className={[
            'categories-root',
            showAllCategories ? 'showing' : 'hidden'
          ].join(' ')}>
          {renderCategoryTree(categoryTree, 0)}
          {
            showAllCategories ?
              <Button onClick={()=>setShowAllCategories(false)}>
                Hide Categories!
              </Button>:
              <Button onClick={()=>setShowAllCategories(true)}>
                Show All Categories!
              </Button>
          }
        </div>
        {
          productsInCategoryList.map((category) => {
            return (
              <div className='category-row' key={'product_category_' + category._id}>
                <div className='category'>
                  <h4>{category.name}</h4>
                  <Button
                    className='showall'
                    onClick={() => navigate('/search?category' + category._id)}>
                    Show all
                  </Button>
                </div>
                <div className='products'>
                  {category.products.map((product) => {
                    return (
                      <ProductCard key={product._id} product={product} addProductToComp={addProductToComp}/>
                    );
                  })}
                </div>
              </div>
            );
          })
        }
      </div>
      {(categoryTreeLoading || productsIncategoryListLoading) && <Loading />}
    </div>
  );
};


const mapStateToProps = function(state) {
  return {
    categoryTreeLoading: state.category.categoryTreeLoading,
    categoryTree: state.category.categoryTree,
    productsIncategoryListLoading: state.productsInCategory.productsIncategoryListLoading,
    productsInCategoryList: state.productsInCategory.productsIncategoryList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCategoryTree: () => {
      dispatch(getCategoryTree());
    },
    getProductsInCategoryList: () => {
      dispatch(getProductsInCategoryList());
    },
    addProductToComp: (product) => {
      dispatch(addProductToComp(product));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserHomePage);
