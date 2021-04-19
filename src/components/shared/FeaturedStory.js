import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import QuickStoryCard from "../cards/QuickStoryCard";
import {
  fetchAllStories,
  fetchPreviewStory,
  previewOut,
} from "../../../redux/actions/salesStory";
import PreviewStoryModal from "../../PreviewStoryModal";
import { makeBookmarkStory,updateBookmark } from "../../../redux/actions/bookmark";

//Functional component starts
export default function QuickStoryList({ filterData }) {

  //Hooks call
  const dispatch = useDispatch();
  const [listData, setListData] = React.useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const { result,bookMark_status } = useSelector((state) => state.allStories.allStory.data);
  console.log("data",result);
  console.log("bookMark_status",bookMark_status);
  const previewStory = useSelector(
    (state) => state.allStories.PreviewStory.data
  );

  //componentDidUpdate
  useEffect(() => {
    previewStory && setOpenPreview(true);
  }, [previewStory]);

  //componentDidUpdate
  useEffect(() => {
    setOpenPreview(false);
  }, [window.location.href]);

  //componentDidMount
  useEffect(() => {
    dispatch(fetchAllStories());
  }, []);

  //componentDidUpdate
  useEffect(() => {
    filterList();
  }, [filterData]);

  //componentDidUpdate
  useEffect(() => {
    setListData(result);
  }, [result]);

  //handler to fetch preview story
  const handleShowPreviewStory = (id) => {
    console.log("inside handleShowPreviewStory: id---->", id);
    dispatch(fetchPreviewStory(id));
  };

  //handler to bookmark the story
  const handleMakeBookmark = (data) => {
    let obj = {
      postId: data._id,
      channelName: data.channelName,
      title: data.title,
      region: data.region,
      product: data.product,
      segment: data.segment,
      bookMark_status: true,
      featuredStory: data.featuredStory
    };
    console.log("inside handleMakeBookmark id---->", obj);
    dispatch(makeBookmarkStory(obj));
  };
  //handler to remove bookmark
  const handleDeleteBookmark = (data) =>{
    dispatch(updateBookmark(data));
  }

  //handler to close modal and initialise redux state of preview
  const closeModal = () => {
    setOpenPreview(false);
    dispatch(previewOut());
  };

  //handler to filter the story depending on tags selected
  const filterList = () => {
    let filterObj = {};
    for (let key in filterData) {
      if (filterData[key]) {
        filterObj[key] = filterData[key];
      }
    }
    if (_.isEmpty(filterObj)) {
      result &&
      setListData(result);
    } else {
      let filteredList =
        result &&
        result.filter((item, index) => {
          let itemFound = false;

          for (let key in filterObj) {
            if (filterObj[key] == item[key]) {
              itemFound = true;
            } else {
              itemFound = false;
              break;
            }
          }
          if (itemFound) {
            return item;
          }
        });
      setListData(filteredList);
    }
  };
  console.log("listData",listData);


  if (listData == null) {
    return <div>  Hang on tight. We are fetching your stories.</div>;
  }
  
  return (
    <>
      {listData.map((item, index) => {
        return (
          <QuickStoryCard
            item={item}
            bookMark_status = {bookMark_status}
            key={index}
            handleShowPreviewStory={handleShowPreviewStory}
            handleMakeBookmark={handleMakeBookmark}
            handleDeleteBookmark = {handleDeleteBookmark }
          />
        );
      })}
      {previewStory && (
        <PreviewStoryModal
          dialogAction={openPreview}
          storyDetailsData={previewStory}
          closeDialog={closeModal}
        />
      )}
    </>
  );
}
