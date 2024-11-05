import { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  DecoupledEditor,
  Plugin,
  ButtonView,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  Bold,
  CKBox,
  CKBoxImageEdit,
  CloudServices,
  Code,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Mention,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  PictureEditing,
  RemoveFormat,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";
import {
  AIAssistant,
  CaseChange,
  Comments,
  DocumentOutline,
  ExportPdf,
  ExportWord,
  FormatPainter,
  ImportWord,
  MultiLevelList,
  OpenAITextAdapter,
  Pagination,
  PasteFromOfficeEnhanced,
  PresenceList,
  RealTimeCollaborativeComments,
  RealTimeCollaborativeEditing,
  RealTimeCollaborativeRevisionHistory,
  RealTimeCollaborativeTrackChanges,
  RevisionHistory,
  SlashCommand,
  TableOfContents,
  Template,
  TrackChanges,
  TrackChangesData,
} from "ckeditor5-premium-features";

import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";

import "./ckeditor.css";

/**
 * Please update the following values with your actual tokens.
 * Instructions on how to obtain them: https://ckeditor.com/docs/trial/latest/guides/real-time/quick-start.html
 
const LICENSE_KEY = process.env.REACT_APP_LICENSE_KEY;
 const AI_API_URL = '<YOUR_AI_API_URL>'; 
const CKBOX_TOKEN_URL = process.env.REACT_APP_CKBOX_TOKEN_URL;
/* const UNIQUE_CHANNEL_PER_DOCUMENT = 'channel-1'; // can you change, na ung user makakaaccess nito base on user.id 
const CLOUD_SERVICES_TOKEN_URL = process.env.REACT_APP_CLOUD_SERVICES_TOKEN_URL;
const CLOUD_SERVICES_WEBSOCKET_URL = process.env.REACT_APP_CLOUD_SERVICES_WEBSOCKET_URL;*/

const LICENSE_KEY = import.meta.env.VITE_APP_LICENSE_KEY;
const CKBOX_TOKEN_URL = import.meta.env.VITE_APP_CKBOX_TOKEN_URL; /* 
const CLOUD_SERVICES_TOKEN_URL = import.meta.env.VITE_APP_CLOUD_SERVICES_TOKEN_URL; */
const CLOUD_SERVICES_WEBSOCKET_URL = import.meta.env
  .VITE_APP_CLOUD_SERVICES_WEBSOCKET_URL;

/**
 * The `AnnotationsSidebarToggler` plugin adds an icon to the right side of the editor.
 *
 * It allows to toggle the right annotations bar visibility.
 */
class AnnotationsSidebarToggler extends Plugin {
  static get requires() {
    return ["AnnotationsUIs"];
  }

  static get pluginName() {
    return "AnnotationsSidebarToggler";
  }

  init() {
    this.toggleButton = new ButtonView(this.editor.locale);

    const NON_COLLAPSE_ANNOTATION_ICON =
      '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="matrix(-1,0,0,1,0,0)"><path d="M11.463 5.187a.888.888 0 1 1 1.254 1.255L9.16 10l3.557 3.557a.888.888 0 1 1-1.254 1.255L7.26 10.61a.888.888 0 0 1 .16-1.382l4.043-4.042z"></path></svg>';
    const COLLAPSE_ANNOTATION_ICON =
      '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" transform="matrix(1,0,0,1,0,0)"><path d="M11.463 5.187a.888.888 0 1 1 1.254 1.255L9.16 10l3.557 3.557a.888.888 0 1 1-1.254 1.255L7.26 10.61a.888.888 0 0 1 .16-1.382l4.043-4.042z"/></svg>';

    const annotationsUIsPlugin = this.editor.plugins.get("AnnotationsUIs");
    const annotationsContainer = this.editor.config.get("sidebar.container");
    const sidebarContainer = annotationsContainer.parentElement;

    this.toggleButton.set({
      label: "Toggle annotations sidebar",
      tooltip: "Hide annotations sidebar",
      tooltipPosition: "se",
      icon: COLLAPSE_ANNOTATION_ICON,
    });

    this.toggleButton.on("execute", () => {
      // Toggle a CSS class on the annotations sidebar container to manage the visibility of the sidebar.
      annotationsContainer.classList.toggle("ck-hidden");

      // Change the look of the button to reflect the state of the annotations container.
      if (annotationsContainer.classList.contains("ck-hidden")) {
        this.toggleButton.icon = NON_COLLAPSE_ANNOTATION_ICON;
        this.toggleButton.tooltip = "Show annotations sidebar";
        annotationsUIsPlugin.switchTo("inline");
      } else {
        this.toggleButton.icon = COLLAPSE_ANNOTATION_ICON;
        this.toggleButton.tooltip = "Hide annotations sidebar";
        annotationsUIsPlugin.switchTo("wideSidebar");
      }

      // Keep the focus in the editor whenever the button is clicked.
      this.editor.editing.view.focus();
    });

    this.toggleButton.render();

    sidebarContainer.insertBefore(
      this.toggleButton.element,
      annotationsContainer
    );
  }

  destroy() {
    this.toggleButton.element.remove();

    return super.destroy();
  }
}

/**
 * The `DocumentOutlineToggler` plugin adds an icon to the left side of the editor.
 *
 * It allows to toggle document outline visibility.
 */
class DocumentOutlineToggler extends Plugin {
  static get pluginName() {
    return "DocumentOutlineToggler";
  }

  init() {
    this.toggleButton = new ButtonView(this.editor.locale);

    const DOCUMENT_OUTLINE_ICON =
      '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 9.5a.5.5 0 0 0 .5-.5v-.5A.5.5 0 0 0 5 8H3.5a.5.5 0 0 0-.5.5V9a.5.5 0 0 0 .5.5H5Z"/><path d="M5.5 12a.5.5 0 0 1-.5.5H3.5A.5.5 0 0 1 3 12v-.5a.5.5 0 0 1 .5-.5H5a.5.5 0 0 1 .5.5v.5Z"/><path d="M5 6.5a.5.5 0 0 0 .5-.5v-.5A.5.5 0 0 0 5 5H3.5a.5.5 0 0 0-.5.5V6a.5.5 0 0 0 .5.5H5Z"/><path clip-rule="evenodd" d="M2 19a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2Zm6-1.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H8v15Zm-1.5-15H2a.5.5 0 0 0-.5.5v14a.5.5 0 0 0 .5.5h4.5v-15Z"/></svg>';
    const COLLAPSE_OUTLINE_ICON =
      '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.463 5.187a.888.888 0 1 1 1.254 1.255L9.16 10l3.557 3.557a.888.888 0 1 1-1.254 1.255L7.26 10.61a.888.888 0 0 1 .16-1.382l4.043-4.042z"/></svg>';

    const documentOutlineContainer = this.editor.config.get(
      "documentOutline.container"
    );
    const sidebarContainer = documentOutlineContainer.parentElement;

    this.toggleButton.set({
      label: "Toggle document outline",
      tooltip: "Hide document outline",
      tooltipPosition: "se",
      icon: COLLAPSE_OUTLINE_ICON,
    });

    this.toggleButton.on("execute", () => {
      // Toggle a CSS class on the document outline container to manage the visibility of the outline.
      documentOutlineContainer.classList.toggle("ck-hidden");

      // Change the look of the button to reflect the state of the document outline feature.
      if (documentOutlineContainer.classList.contains("ck-hidden")) {
        this.toggleButton.icon = DOCUMENT_OUTLINE_ICON;
        this.toggleButton.tooltip = "Show document outline";
      } else {
        this.toggleButton.icon = COLLAPSE_OUTLINE_ICON;
        this.toggleButton.tooltip = "Hide document outline";
      }

      // Keep the focus in the editor whenever the button is clicked.
      this.editor.editing.view.focus();
    });

    this.toggleButton.render();

    sidebarContainer.insertBefore(
      this.toggleButton.element,
      documentOutlineContainer
    );
  }

  destroy() {
    this.toggleButton.element.remove();

    return super.destroy();
  }
}

export default function App({ userId, channelId }) {
  const editorPresenceRef = useRef(null);
  const editorContainerRef = useRef(null);
  const editorMenuBarRef = useRef(null);
  const editorToolbarRef = useRef(null);
  const editorOutlineRef = useRef(null);
  const editorRef = useRef(null);
  const editorAnnotationsRef = useRef(null);
  const editorRevisionHistoryRef = useRef(null);
  const editorRevisionHistoryEditorRef = useRef(null);
  const editorRevisionHistorySidebarRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const generateUniqueChannelId = (channelId) => {
    return `channel-${channelId}`;
  };

  const generatedChannelId = generateUniqueChannelId(channelId);

  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "previousPage",
        "nextPage",
        "pageNavigation",
        "|",
        "revisionHistory",
        "trackChanges",
        "comment",
        "commentsArchive",
        "|",
        "aiCommands",
        "aiAssistant",
        "|",
        "importWord",
        "exportWord",
        "exportPdf",
        "formatPainter",
        "caseChange",
        "findAndReplace",
        "selectAll",
        "|",
        "heading",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "subscript",
        "superscript",
        "code",
        "removeFormat",
        "|",
        "specialCharacters",
        "horizontalLine",
        "pageBreak",
        "link",
        "insertImage",
        "insertImageViaUrl",
        "ckbox",
        "insertTable",
        "tableOfContents",
        "insertTemplate",
        "highlight",
        "blockQuote",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "multiLevelList",
        "todoList",
        "outdent",
        "indent",
        "|",
        "accessibilityHelp",
      ],
      shouldNotGroupWhenFull: false,
    },

    plugins: [
      AccessibilityHelp,
      AIAssistant,
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      Bold,
      CaseChange,
      CKBox,
      CKBoxImageEdit,
      CloudServices,
      Code,
      Comments,
      DocumentOutline,
      Essentials,
      ExportPdf,
      ExportWord,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      FormatPainter,
      Heading,
      Highlight,
      HorizontalLine,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      ImportWord,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      Mention,
      MultiLevelList,
      OpenAITextAdapter,
      PageBreak,
      Pagination,
      Paragraph,
      PasteFromOffice,
      PasteFromOfficeEnhanced,
      PictureEditing,
      PresenceList,
      RealTimeCollaborativeComments,
      RealTimeCollaborativeEditing,
      RealTimeCollaborativeRevisionHistory,
      RealTimeCollaborativeTrackChanges,
      RemoveFormat,
      RevisionHistory,
      SelectAll,
      SlashCommand,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableOfContents,
      TableProperties,
      TableToolbar,
      Template,
      TextTransformation,
      TodoList,
      TrackChanges,
      TrackChangesData,
      Underline,
      Undo,
    ],
    balloonToolbar: [
      "comment",
      "|",
      "aiAssistant",
      "|",
      "bold",
      "italic",
      "|",
      "link",
      "insertImage",
      "|",
      "bulletedList",
      "numberedList",
    ],
    ckbox: {
      tokenUrl: CKBOX_TOKEN_URL,
    },
    cloudServices: {
      tokenUrl: `http://localhost:7000/api/advicer/get-ckeditor-token/${userId}`,
      webSocketUrl: CLOUD_SERVICES_WEBSOCKET_URL,
    },
    collaboration: {
      channelId: generatedChannelId, // Pass the generated channelId here
    },
    presenceList: {
      container: editorPresenceRef.current,
      // Additional configuration.
      collapseAt: 3,
      onClick: (userId, element) => console.log(userId, element),
    },
    comments: {
      editorConfig: {
        extraPlugins: [Autoformat, Bold, Italic, List, Mention],
        mention: {
          feeds: [
            {
              marker: "@",
              feed: [
                /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#comments-with-mentions */
              ],
            },
          ],
        },
      },
    },
    documentOutline: {
      container: editorOutlineRef.current,
    },
    exportPdf: {
      stylesheets: [
        /* This path should point to application stylesheets. */
        /* See: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-pdf.html */
        "./App.css",
        /* Export PDF needs access to stylesheets that style the content. */
        "https://cdn.ckeditor.com/ckeditor5/42.0.2/ckeditor5.css",
        "https://cdn.ckeditor.com/ckeditor5-premium-features/42.0.2/ckeditor5-premium-features.css",
      ],
      fileName: "export-pdf-demo.pdf",
      converterOptions: {
        format: "A4",
        margin_top: "20mm",
        margin_bottom: "20mm",
        margin_right: "12mm",
        margin_left: "12mm",
        page_orientation: "portrait",
      },
    },
    exportWord: {
      stylesheets: [
        /* This path should point to application stylesheets. */
        /* See: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-word.html */
        "./App.css",
        /* Export Word needs access to stylesheets that style the content. */
        "https://cdn.ckeditor.com/ckeditor5/42.0.2/ckeditor5.css",
        "https://cdn.ckeditor.com/ckeditor5-premium-features/42.0.2/ckeditor5-premium-features.css",
      ],
      fileName: "export-word-demo.docx",
      converterOptions: {
        format: "A4",
        margin_top: "20mm",
        margin_bottom: "20mm",
        margin_right: "12mm",
        margin_left: "12mm",
        orientation: "portrait",
      },
    },
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    image: {
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "imageStyle:inline",
        "imageStyle:wrapText",
        "imageStyle:breakText",
        "|",
        "resizeImage",
        "|",
        "ckboxImageEdit",
      ],
    },
    initialData:
      '<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n    You\'ve successfully created a CKEditor 5 project. This powerful text editor will enhance your application, enabling rich text editing\n    capabilities that are customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n    <li>\n        <strong>Integrate into your app</strong>: time to bring the editing into your application. Take the code you created and add to your\n        application.\n    </li>\n    <li>\n        <strong>Explore features:</strong> Experiment with different plugins and toolbar options to discover what works best for your needs.\n    </li>\n    <li>\n        <strong>Customize your editor:</strong> Tailor the editor\'s configuration to match your application\'s style and requirements. Or even\n        write your plugin!\n    </li>\n</ol>\n<p>\n    Keep experimenting, and don\'t hesitate to push the boundaries of what you can achieve with CKEditor 5. Your feedback is invaluable to us\n    as we strive to improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n    <li>📝 <a href="https://orders.ckeditor.com/trial/premium-features">Trial sign up</a>,</li>\n    <li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n    <li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n    <li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n    <li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n    See this text, but the editor is not starting up? Check the browser\'s console for clues and guidance. It may be related to an incorrect\n    license key if you use premium features or another feature-related requirement. If you cannot make it work, file a GitHub issue, and we\n    will help as soon as possible!\n</p>\n',
    licenseKey: LICENSE_KEY,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    mention: {
      feeds: [
        {
          marker: "@",
          feed: [
            /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
          ],
        },
      ],
    },
    menuBar: {
      isVisible: true,
    },
    pagination: {
      pageWidth: "21cm",
      pageHeight: "29.7cm",
      pageMargins: {
        top: "20mm",
        bottom: "20mm",
        right: "12mm",
        left: "12mm",
      },
    },
    placeholder: "Type or paste your content here!",

    revisionHistory: {
      editorContainer: editorContainerRef.current,
      viewerContainer: editorRevisionHistoryRef.current,
      viewerEditorElement: editorRevisionHistoryEditorRef.current,
      viewerSidebarContainer: editorRevisionHistorySidebarRef.current,
      resumeUnsavedRevision: true,
    },
    sidebar: {
      container: editorAnnotationsRef.current,
    },
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
    template: {
      definitions: [
        {
          title: "Introduction",
          description: "Simple introduction to an article",
          icon: '<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <g id="icons/article-image-right">\n        <rect id="icon-bg" width="45" height="45" rx="2" fill="#A5E7EB"/>\n        <g id="page" filter="url(#filter0_d_1_507)">\n            <path d="M9 41H36V12L28 5H9V41Z" fill="white"/>\n            <path d="M35.25 12.3403V40.25H9.75V5.75H27.7182L35.25 12.3403Z" stroke="#333333" stroke-width="1.5"/>\n        </g>\n        <g id="image">\n            <path id="Rectangle 22" d="M21.5 23C21.5 22.1716 22.1716 21.5 23 21.5H31C31.8284 21.5 32.5 22.1716 32.5 23V29C32.5 29.8284 31.8284 30.5 31 30.5H23C22.1716 30.5 21.5 29.8284 21.5 29V23Z" fill="#B6E3FC" stroke="#333333"/>\n            <path id="Vector 1" d="M24.1184 27.8255C23.9404 27.7499 23.7347 27.7838 23.5904 27.9125L21.6673 29.6268C21.5124 29.7648 21.4589 29.9842 21.5328 30.178C21.6066 30.3719 21.7925 30.5 22 30.5H32C32.2761 30.5 32.5 30.2761 32.5 30V27.7143C32.5 27.5717 32.4391 27.4359 32.3327 27.3411L30.4096 25.6268C30.2125 25.451 29.9127 25.4589 29.7251 25.6448L26.5019 28.8372L24.1184 27.8255Z" fill="#44D500" stroke="#333333" stroke-linejoin="round"/>\n            <circle id="Ellipse 1" cx="26" cy="25" r="1.5" fill="#FFD12D" stroke="#333333"/>\n        </g>\n        <rect id="Rectangle 23" x="13" y="13" width="12" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 24" x="13" y="17" width="19" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 25" x="13" y="21" width="6" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 26" x="13" y="25" width="6" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 27" x="13" y="29" width="6" height="2" rx="1" fill="#B4B4B4"/>\n        <rect id="Rectangle 28" x="13" y="33" width="16" height="2" rx="1" fill="#B4B4B4"/>\n    </g>\n    <defs>\n        <filter id="filter0_d_1_507" x="9" y="5" width="28" height="37" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n            <feFlood flood-opacity="0" result="BackgroundImageFix"/>\n            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>\n            <feOffset dx="1" dy="1"/>\n            <feComposite in2="hardAlpha" operator="out"/>\n            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.29 0"/>\n            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_507"/>\n            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_507" result="shape"/>\n        </filter>\n    </defs>\n</svg>\n',
          data: "<h2>Introduction</h2><p>In today's fast-paced world, keeping up with the latest trends and insights is essential for both personal growth and professional development. This article aims to shed light on a topic that resonates with many, providing valuable information and actionable advice. Whether you're seeking to enhance your knowledge, improve your skills, or simply stay informed, our comprehensive analysis offers a deep dive into the subject matter, designed to empower and inspire our readers.</p>",
        },
      ],
    },
  };

  return (
    <div>
      <div className='main-container'>
        <div className='presence' ref={editorPresenceRef}></div>
        <div
          className='editor-container editor-container_document-editor editor-container_include-outline editor-container_include-annotations editor-container_include-pagination'
          ref={editorContainerRef}
        >
          <div
            className='editor-container__menu-bar'
            ref={editorMenuBarRef}
          ></div>
          <div
            className='editor-container__toolbar'
            ref={editorToolbarRef}
          ></div>
          <div className='editor-container__editor-wrapper'>
            <div className='editor-container__sidebar'>
              <div ref={editorOutlineRef}></div>
            </div>
            <div className='editor-container__editor'>
              <div ref={editorRef}>
                {isLayoutReady && (
                  <CKEditor
                    onReady={(editor) => {
                      editorToolbarRef.current.appendChild(
                        editor.ui.view.toolbar.element
                      );
                      editorMenuBarRef.current.appendChild(
                        editor.ui.view.menuBarView.element
                      );
                    }}
                    onAfterDestroy={() => {
                      Array.from(editorToolbarRef.current.children).forEach(
                        (child) => child.remove()
                      );
                      Array.from(editorMenuBarRef.current.children).forEach(
                        (child) => child.remove()
                      );
                    }}
                    editor={DecoupledEditor}
                    config={editorConfig}
                  />
                )}
              </div>
            </div>
            <div className='editor-container__sidebar'>
              <div ref={editorAnnotationsRef}></div>
            </div>
          </div>
        </div>

        <div className='revision-history' ref={editorRevisionHistoryRef}>
          <div className='revision-history__wrapper'>
            <div
              className='revision-history__editor'
              ref={editorRevisionHistoryEditorRef}
            ></div>
            <div
              className='revision-history__sidebar'
              ref={editorRevisionHistorySidebarRef}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
