import { Checkbox, Image, Pagination, Space } from "antd";
import React, { FunctionComponent, ReactElement, ReactNode, useState } from "react";
import { GetSearchQueryPropsI, SearchQueryResI } from "_types/api";
import Gallery from "react-photo-gallery";
import { ImgI } from "_types/resources";

import "./style.less";
import { formatDate, getSelected } from "_helper";

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

          if (data) {
            const item = data.results[index];

            imgId = `${item.id}`;
            imgName = `${item.filename}`;
            createDate = `${formatDate(item.created_at, true)}`;
          }

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
