import { Checkbox, Image, Pagination, Empty } from "antd";
import React, { FunctionComponent, ReactElement } from "react";
import { GetSearchQueryPropsI, SearchQueryResI } from "_types/api";
import Gallery from "react-photo-gallery";
import { ImgI } from "_types/resources";
import { formatDate, getSelected } from "_helper";

import "./style.less";

interface ImgCardsPropsI {
  searchQuery: GetSearchQueryPropsI;
  data?: SearchQueryResI<ImgI>;
  isSelectable?: boolean; // 是否选择模式
  selected?: string[]; // 已选择的id
  onSelected?: (selected: string[]) => void; //  当选择时触发
  onChangePagination?: (current: number) => void; // 当页码更新时触发
}

const ImgCards: FunctionComponent<ImgCardsPropsI> = (props) => {
  const { data, searchQuery, onSelected, onChangePagination, selected, isSelectable } = props;
  const { current, size } = searchQuery;
  const imgs: { src: string; width: number; height: number }[] = [];

  if (data) {
    const { results } = data;
    results.forEach((item) => imgs.push({ src: item.url, width: 1, height: 1 }));
  }

  const onClickImg = (id: string): void => {
    const list = getSelected(selected || [], id);
    onSelected && onSelected(list);
  };

  if (!data) return null;
  const { results } = data;

  if (!results.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <div className="resources-img-cards">
      <Gallery
        photos={imgs}
        renderImage={(item): ReactElement => {
          const { photo, margin, index } = item;
          const { src, width, height } = photo;
          let imgId = "",
            imgName = "NA",
            createDate = "NA";

          const img = results[index];

          imgId = `${img.id}`;
          imgName = `${img.filename}`;
          createDate = `${formatDate(img.created_at, true)}`;

          return (
            <div
              key={src}
              className="resources-img-cards-item"
              style={{ margin: `${margin}px` }}
              onClick={(): void => {
                isSelectable && onClickImg(imgId);
              }}
            >
              {/* <div
                className="resources-img-cards-item-mask"
                onClick={(): void => {
                  isSelectable && onClickImg(imgId);
                }}
              ></div> */}
              <Checkbox
                className={`resources-img-cards-checkbox${isSelectable ? " show" : ""}`}
                checked={data && selected ? selected.indexOf(imgId) > -1 : false}
                onClick={(): void => {
                  isSelectable && onClickImg(imgId);
                }}
              ></Checkbox>
              <Image
                placeholder
                width={width}
                height={height}
                src={src}
                loading="lazy"
                preview={!isSelectable}
              ></Image>
              <div className="resources-img-cards-info">
                <span className="resources-img-cards-name">{imgName}</span>
                <span className="resources-img-cards-date">{createDate}</span>
              </div>
            </div>
          );
        }}
      ></Gallery>
      <Pagination
        style={{ marginTop: `${20}px` }}
        current={current}
        pageSize={size}
        total={data ? data.count : 0}
        onChange={(page): void => {
          onChangePagination && onChangePagination(page);
        }}
      ></Pagination>
    </div>
  );
};

export default ImgCards;