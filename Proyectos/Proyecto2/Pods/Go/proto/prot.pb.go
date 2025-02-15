// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.25.0-devel
// 	protoc        v4.24.4
// source: proto/prot.proto

package proto

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type CalificacionRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Carnet   int64  `protobuf:"varint,1,opt,name=carnet,proto3" json:"carnet,omitempty"`
	Nombre   string `protobuf:"bytes,2,opt,name=nombre,proto3" json:"nombre,omitempty"`
	Curso    string `protobuf:"bytes,3,opt,name=curso,proto3" json:"curso,omitempty"`
	Nota     int64  `protobuf:"varint,4,opt,name=nota,proto3" json:"nota,omitempty"`
	Semestre string `protobuf:"bytes,5,opt,name=semestre,proto3" json:"semestre,omitempty"`
	Year     int64  `protobuf:"varint,6,opt,name=year,proto3" json:"year,omitempty"`
}

func (x *CalificacionRequest) Reset() {
	*x = CalificacionRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_prot_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *CalificacionRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CalificacionRequest) ProtoMessage() {}

func (x *CalificacionRequest) ProtoReflect() protoreflect.Message {
	mi := &file_proto_prot_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CalificacionRequest.ProtoReflect.Descriptor instead.
func (*CalificacionRequest) Descriptor() ([]byte, []int) {
	return file_proto_prot_proto_rawDescGZIP(), []int{0}
}

func (x *CalificacionRequest) GetCarnet() int64 {
	if x != nil {
		return x.Carnet
	}
	return 0
}

func (x *CalificacionRequest) GetNombre() string {
	if x != nil {
		return x.Nombre
	}
	return ""
}

func (x *CalificacionRequest) GetCurso() string {
	if x != nil {
		return x.Curso
	}
	return ""
}

func (x *CalificacionRequest) GetNota() int64 {
	if x != nil {
		return x.Nota
	}
	return 0
}

func (x *CalificacionRequest) GetSemestre() string {
	if x != nil {
		return x.Semestre
	}
	return ""
}

func (x *CalificacionRequest) GetYear() int64 {
	if x != nil {
		return x.Year
	}
	return 0
}

type ReplyInfo struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Info string `protobuf:"bytes,1,opt,name=info,proto3" json:"info,omitempty"`
}

func (x *ReplyInfo) Reset() {
	*x = ReplyInfo{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_prot_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ReplyInfo) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ReplyInfo) ProtoMessage() {}

func (x *ReplyInfo) ProtoReflect() protoreflect.Message {
	mi := &file_proto_prot_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ReplyInfo.ProtoReflect.Descriptor instead.
func (*ReplyInfo) Descriptor() ([]byte, []int) {
	return file_proto_prot_proto_rawDescGZIP(), []int{1}
}

func (x *ReplyInfo) GetInfo() string {
	if x != nil {
		return x.Info
	}
	return ""
}

var File_proto_prot_proto protoreflect.FileDescriptor

var file_proto_prot_proto_rawDesc = []byte{
	0x0a, 0x10, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x2e, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x12, 0x05, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0x9f, 0x01, 0x0a, 0x13, 0x43, 0x61,
	0x6c, 0x69, 0x66, 0x69, 0x63, 0x61, 0x63, 0x69, 0x6f, 0x6e, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x12, 0x16, 0x0a, 0x06, 0x63, 0x61, 0x72, 0x6e, 0x65, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28,
	0x03, 0x52, 0x06, 0x63, 0x61, 0x72, 0x6e, 0x65, 0x74, 0x12, 0x16, 0x0a, 0x06, 0x6e, 0x6f, 0x6d,
	0x62, 0x72, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x6e, 0x6f, 0x6d, 0x62, 0x72,
	0x65, 0x12, 0x14, 0x0a, 0x05, 0x63, 0x75, 0x72, 0x73, 0x6f, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x05, 0x63, 0x75, 0x72, 0x73, 0x6f, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x6f, 0x74, 0x61, 0x18,
	0x04, 0x20, 0x01, 0x28, 0x03, 0x52, 0x04, 0x6e, 0x6f, 0x74, 0x61, 0x12, 0x1a, 0x0a, 0x08, 0x73,
	0x65, 0x6d, 0x65, 0x73, 0x74, 0x72, 0x65, 0x18, 0x05, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x73,
	0x65, 0x6d, 0x65, 0x73, 0x74, 0x72, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x79, 0x65, 0x61, 0x72, 0x18,
	0x06, 0x20, 0x01, 0x28, 0x03, 0x52, 0x04, 0x79, 0x65, 0x61, 0x72, 0x22, 0x1f, 0x0a, 0x09, 0x72,
	0x65, 0x70, 0x6c, 0x79, 0x49, 0x6e, 0x66, 0x6f, 0x12, 0x12, 0x0a, 0x04, 0x69, 0x6e, 0x66, 0x6f,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x69, 0x6e, 0x66, 0x6f, 0x32, 0x4d, 0x0a, 0x0c,
	0x47, 0x72, 0x61, 0x64, 0x65, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x3d, 0x0a, 0x0b,
	0x53, 0x75, 0x62, 0x6d, 0x69, 0x74, 0x47, 0x72, 0x61, 0x64, 0x65, 0x12, 0x1a, 0x2e, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x2e, 0x43, 0x61, 0x6c, 0x69, 0x66, 0x69, 0x63, 0x61, 0x63, 0x69, 0x6f, 0x6e,
	0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x10, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2e,
	0x72, 0x65, 0x70, 0x6c, 0x79, 0x49, 0x6e, 0x66, 0x6f, 0x22, 0x00, 0x42, 0x09, 0x5a, 0x07, 0x2e,
	0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_proto_prot_proto_rawDescOnce sync.Once
	file_proto_prot_proto_rawDescData = file_proto_prot_proto_rawDesc
)

func file_proto_prot_proto_rawDescGZIP() []byte {
	file_proto_prot_proto_rawDescOnce.Do(func() {
		file_proto_prot_proto_rawDescData = protoimpl.X.CompressGZIP(file_proto_prot_proto_rawDescData)
	})
	return file_proto_prot_proto_rawDescData
}

var file_proto_prot_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_proto_prot_proto_goTypes = []interface{}{
	(*CalificacionRequest)(nil), // 0: proto.CalificacionRequest
	(*ReplyInfo)(nil),           // 1: proto.replyInfo
}
var file_proto_prot_proto_depIdxs = []int32{
	0, // 0: proto.GradeService.SubmitGrade:input_type -> proto.CalificacionRequest
	1, // 1: proto.GradeService.SubmitGrade:output_type -> proto.replyInfo
	1, // [1:2] is the sub-list for method output_type
	0, // [0:1] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_proto_prot_proto_init() }
func file_proto_prot_proto_init() {
	if File_proto_prot_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_proto_prot_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*CalificacionRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_proto_prot_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ReplyInfo); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_proto_prot_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_proto_prot_proto_goTypes,
		DependencyIndexes: file_proto_prot_proto_depIdxs,
		MessageInfos:      file_proto_prot_proto_msgTypes,
	}.Build()
	File_proto_prot_proto = out.File
	file_proto_prot_proto_rawDesc = nil
	file_proto_prot_proto_goTypes = nil
	file_proto_prot_proto_depIdxs = nil
}
