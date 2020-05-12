/* eslint-disable @typescript-eslint/camelcase */
/* 

  upload_to = 上传文件路径
  md5 = 文件的MD5值
  source = 来源类型 
  doi = 文章DOI值 
  title = 文章标题 
  journal = 杂志 
  authors = 作者 
  source_url = 资源链接 
  description = 描述 
  figure_series = 图片在文章里的序列号 
  pictures = 图片url地址数组
  dicom_flag = 是否是DICOM文件 
  flag = 可视标志 
  published_at = 文章发表时间 
  created_at = 资源收录时间

*/

import React, { FunctionComponent, useState, useEffect } from "react";

import "./Gallery.less";
import { Input, Button, Popconfirm, DatePicker, message, Select } from "antd";
import { Random } from "mockjs";
import { GalleryI, GalleryStatsI } from "_constants/interface";
import GalleryList from "./components/List/List";
import EditorPanel from "./components/EditorPanel/EditorPanel";
import { getPublicImages, delPublicImages, getPublicImageStats } from "_services/dicom";
import { isNull, isUndefined } from "util";

const GALLERY = {
  id: "",
  upload_to: "",
  md5: "",
  source: "",
  doi: "",
  title: "",
  journal: "",
  authors: "",
  source_url: "",
  description: "",
  figure_series: "",
  picture: "",
  dicom_flag: 0,
  flag: 0,
  published_at: "",
  created_at: "",
  series_id: "",
  image_type: "",
  image_type_name: "",
};

// const getMock = (count: number): GalleryI[] => {
//   const result: GalleryI[] = [];

//   for (; count > 0; count--) {
//     result.push({
//       id: Random.string(),
//       upload_to: Random.url(),
//       md5: Random.string(),
//       source: ["article", "ppt", "public_db"][Random.natural(0, 2)],
//       doi: Random.string(),
//       title: Random.title(1, 4),
//       journal: Random.ctitle(1, 2),
//       authors: Random.cname(),
//       source_url: Random.url(),
//       description: Random.csentence(5, 20),
//       figure_series: `${Random.natural()}`,
//       picture: Random.url(),
//       dicom_flag: Random.natural(0, 1),
//       flag: Random.natural(0, 1),
//       published_at: Random.date("yyyy-MM-dd"),
//       created_at: Random.date("yyyy-MM-dd"),
//       series_id: Random.string(),
//     });
//   }

//   return result;
// };

const init = async (): Promise<{ stats: GalleryStatsI[]; gallery: GalleryI[] }> => {
  try {
    const stats = await getPublicImageStats();
    const gallery = await getPublicImages();

    return { stats, gallery };
  } catch (error) {
    throw new Error(error);
  }
};

const Gallery: FunctionComponent = () => {
  const [galleryStats, setGalleryStats] = useState<GalleryStatsI[]>([]);
  const [gallery, setGallery] = useState<GalleryI[]>([]);
  const [search, setSearch] = useState<{
    date?: [string, string];
    title?: string;
    desc?: string;
    imgType?: string;
  }>({});
  const [isShow, setIsShow] = useState(false);
  const [currentGallery, setCurrentGallery] = useState<GalleryI>(GALLERY);
  const [uploadMode, setUploadMode] = useState(false); // 是否为上传模式
  const [selected, setSelected] = useState<string[]>([]); // 已选择的节点

  useEffect(() => {
    /* 这里从后台获取gallery */
    init()
      .then((res) => {
        setGallery(res.gallery);
        setGalleryStats(res.stats);
      })
      .catch((err) => console.error(err));
  }, []);

  const edit = (item: GalleryI): void => {
    setUploadMode(false);
    setCurrentGallery(item);
    setIsShow(true);
  };

  return (
    <div className="gallery">
      <h1>Gallery Manager</h1>
      <section className="gallery-inner">
        <header className="gallery-header">
          <div className="gallery-search">
            <b className="gallery-header-title">搜索/过滤</b>

            <div
              className="gallery-search-item"
              style={{ maxWidth: "200px", display: "flex", alignItems: "center" }}
            >
              <div>影像集类型：</div>
              <Select
                defaultValue=""
                style={{ flexGrow: 1 }}
                onChange={(val: string): void =>
                  setSearch(
                    Object.assign({}, search, {
                      imgType: val,
                    }),
                  )
                }
              >
                <Select.Option value="">全部</Select.Option>
                {galleryStats.map((item) => (
                  <Select.Option value={item.image_type} key={`header_gallery_${item.image_type}`}>
                    {item.image_type_name}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <Input
              className="gallery-search-item"
              addonBefore="标题"
              placeholder="搜索标题名称"
              onInput={(e): void =>
                setSearch(
                  Object.assign({}, search, {
                    title: e.currentTarget.value,
                  }),
                )
              }
            />
            <Input
              className="gallery-search-item"
              addonBefore="描述"
              placeholder="搜索描述信息"
              onInput={(e): void =>
                setSearch(
                  Object.assign({}, search, {
                    desc: e.currentTarget.value,
                  }),
                )
              }
            />
            <DatePicker.RangePicker
              className="gallery-search-item"
              onChange={(_momentArr, dateStringArr): void =>
                setSearch(
                  Object.assign({}, search, {
                    date: dateStringArr.filter((item) => !!item),
                  }),
                )
              }
            ></DatePicker.RangePicker>
          </div>
          {/* <Input
            className="gallery-header-input"
            addonBefore="发表时间"
            placeholder="输入文章发表时间"
            onInput={(e): void =>
              setSearch(
                Object.assign({}, search, {
                  date: e.currentTarget.value,
                }),
              )
            }
          /> */}
          <div className="gallery-header-btns">
            <Button
              type="primary"
              onClick={() => {
                setUploadMode(true);
                setCurrentGallery(GALLERY);
                setIsShow(true);
              }}
            >
              上传
            </Button>

            <Popconfirm
              disabled={!selected.length}
              title={`确定要删除${selected.length}个数据吗？`}
              onConfirm={(): void => {
                /* 从这里删除 */
                selected.length &&
                  delPublicImages(selected)
                    .then(() => {
                      setGallery(gallery.filter((item) => selected.indexOf(item.id || "") < 0));
                      setSelected([]);
                      message.success("删除成功");
                    })
                    .catch((err) => {
                      console.error("%c >> 删除public image出错： ", err, "color: red;");
                      setSelected([]);
                      message.error("删除失败 请查看console");
                    });
              }}
            >
              <Button type="danger">删除</Button>
            </Popconfirm>
          </div>
        </header>
        <GalleryList
          items={gallery}
          search={search}
          onClick={edit}
          onSelect={(selectedIds, selectedItems): void => {
            setSelected(selectedIds as string[]);
          }}
        ></GalleryList>
      </section>

      <EditorPanel
        isShow={isShow}
        gallery={currentGallery}
        galleryStats={galleryStats}
        uploadMode={uploadMode}
        seriesIds={Array.from(
          new Set(
            gallery
              .map((item) => {
                const { series_id } = item;
                if (!series_id || isNull(series_id)) return "";
                return series_id;
              })
              .filter((item) => !!item),
          ),
        )}
        onCancel={(): void => {
          setIsShow(false);
          setCurrentGallery(GALLERY);
        }}
        onUpdate={(resGallery): void => {
          setGallery(
            gallery.map((item) => {
              if (item.id === resGallery.id) {
                item = resGallery;
              }

              return item;
            }),
          );
          setCurrentGallery(GALLERY);
          setIsShow(false);
        }}
        onUpload={(): void => {
          getPublicImages()
            .then((res) => {
              setGallery(res);
              setCurrentGallery(GALLERY);
              setIsShow(false);
            })
            .catch((err) => console.error(err));
        }}
      ></EditorPanel>
    </div>
  );
};

export default Gallery;
