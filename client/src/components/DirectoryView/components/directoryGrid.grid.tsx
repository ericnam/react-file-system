import { AgGridReact } from "ag-grid-react";
import { useRef, useCallback, useEffect } from "react";
import { ColDef, RowClickedEvent } from "ag-grid-community";
import { useAppDispatch, useAppSelector } from "@hooks/redux.hooks";
import {
  getCurrentDirectoryId,
  setCurrentFile,
  setFiles,
} from "reducers/files.slice";
import {
  ISetCurrentFilePayload,
  ISetFilesPayload,
} from "reducers/files.reducer";
import FilesRepository from "repositories/files.repository";
import { faFile, faFolder } from "@fortawesome/free-regular-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DirectoryGridTitleCellRenderer = (props: any) => {
  let icon = null;

  switch (props.data.type) {
    case "directory":
      icon = faFolder;
      break;
    case "file":
      icon = faFile;
      break;
    default:
      break;
  }
  return (
    <span className={`flex items-center`}>
      <span
        className={`flex w-8 h-8 bg-violet-200 items-center justify-center rounded-full mr-4`}
      >
        <FontAwesomeIcon
          icon={icon as IconProp}
          className={`text-violet-600`}
        />
      </span>
      <span>{props.value}</span>
    </span>
  );
};

const DirectoryGridColumnDefinitions: ColDef[] = [
  { field: "fileId", hide: true },
  {
    field: "title",
    headerName: "Name",
    width: 600,
    cellRenderer: DirectoryGridTitleCellRenderer,
  },
  { field: "fileSize", headerName: "File Size" },
  { field: "type", headerName: "Type" },
  { field: "lastUpdated", headerName: "Last Updated" },
];

export const DirectoryGridObj = ({ data }: any) => {
  const dispatch = useAppDispatch();
  const currentDirectoryId = useAppSelector(getCurrentDirectoryId);
  const gridRef = useRef<AgGridReact<any>>();

  useEffect(() => {}, [currentDirectoryId]);

  const qGetFiles = FilesRepository.GetFiles({
    onLoad: (data: any) => {
      dispatch(setFiles({ files: data } as ISetFilesPayload));
    },
  });

  const onGridReady = useCallback(() => {
    if (!!gridRef.current) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, []);

  const onRowClicked = useCallback((event: RowClickedEvent) => {
    console.log(event);
  }, []);

  const onRowDoubleClicked = useCallback((event: RowClickedEvent) => {
    let fileId = event.data.fileId;
    let type = event.data.type;
    if (type === "directory") {
      qGetFiles.api.get({ ids: [fileId] });
      dispatch(setCurrentFile({ fileId: fileId } as ISetCurrentFilePayload));
    }
  }, []);

  return (
    <div className="ag-theme-material flex-1">
      <AgGridReact
        ref={gridRef as any}
        columnDefs={DirectoryGridColumnDefinitions}
        rowData={data}
        onGridReady={onGridReady}
        onRowClicked={onRowClicked}
        onRowDoubleClicked={onRowDoubleClicked}
      ></AgGridReact>
    </div>
  );
};
