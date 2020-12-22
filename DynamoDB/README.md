# Amazon Dynamo-DB

* DynamoDB is a NoSQL Database Service
* Fully Managed Cloud Database,Seamless On-Demand Scaling, Unlimited Concurrent Read/Write Operations
* Single-digit millisecond latency that is again bought down into Sub-microsecond latency with DAX (Caching, DynamoDB Accelerator techniques)
* It has little to No learning curve, with best practices

#### Terminology Comparison with SQL

* Tables => Tables in SQL
* Items => Rows
* Attributes => Columns
* Primary Key (Mandatory, Min : One(Partition) & Max : Two attribute (Partition Key & Sort/Range Key)) => Primary Key (Mulitcolumn and optional)
* Local Secondary Indexes : Indexes
* Global Secondary Indexes : Views

##### DynamoDB Tables
* Top Level Entities
* Independent Entities
* Flexible Schema
* Table Naming Conventions
  * Prefix table names to create namespaces
  * prefix.tablename or prefix_tablename
  * e.g. test.users, test.projects or test_users, test_projects
  * Not Mandatory, yet a good practice to follow

### Data Types in DynamoDB

#### Scalar Types
* Exactly one value
* e.g. string, number, binary, boolean and null
* Keys or Index attributes only support string, number and binary scalar types
###### String
* Stores text data (UTF-8 encoded)
* Only non-empty values
* e.g. "Test", "Prod", "Raja"
###### Number
* Stores all numberic types (+ve/-ve/0)
* e.g. 123, 100.99, -5.4
###### Boolean
* true or flase

###### Null
* Unknown or undefined state

###### Binary
* Blobs of binary data
* e.g. compressed text, encrypted date, images etc
* Only non-empty values
* e.g. "QmdFalsdjfaldjkfojasdkjLKLJlldD..."
#### Set Types
* Multiple scalar values
* Unordered collection of strings, numbers or binary
* e.g. string set, number set and binary set
* Only non-empty values
* No duplicates allowed
* No empty sets allowed
* All values must be of same scalar type
* e.g. ["Apples", "Oranges", "Grapes"]
* e.g. [1, 2.5, 0, -43, 51]
* e.g. ["adafasd=", "V2323F="]

#### Document Types
* Complex structure with nested attributes
* Nesting up to 32 levels deep
* e.g. list and map
* Only non-empty values within lists and maps
* Empty lists and maps are allowed
##### Lists
* Ordered collection of values
* Can have multiple data types
* e.g. ["John", true, 129.9]

##### Maps
* Unordered collection of Key-Value pairs
* Ideal for storing JSON documents

##### AWS Infrastructure
                -> Availability Zone  (AZ) A    -> Facility (DataCenter)A1
                                                -> Facility A2

    AWS Region  -> Availability Zone  (AZ) B    -> Facility B1
                                                -> Facility B2

                -> Availability Zone  (AZ) C    -> Facility B1
                                                -> Facility B2
##### Automatic Synchronous Replication

Facility 1 (SSD) -> Synchronous -> Facility 2 (SSD) -> Replication -> Facility 3 (SSD)

###### High Availability
* 3 Copies of data within a region
* Act as Independent Failure Domains
* Near Real-time Replication

#### DynamoDB Read Consistency
##### Strong Consistency
* The most up-to-date data
* Must be requested explicitly
##### Eventual Consistency
* May or May not reflect the latest copy of data
* Default consistency for all operations
* 50% cheaper

### DynamoDB Capacity Units
* DynamoDB Tables are Top-Level entities
* No Strict inter-table relationships
* Mandatory primary keys
* Control Performance at the table level
#### Throughput Capacity
* Allows for predictable performance at scale
* Used to control read/write throughput
* Supports auto-scaling
* Defined using RCUs (Read Capacity Unit) & WCUs (Write Capacity Units)
* Major factor in DynamoDB pricing
* 1 capacity unit = 1 request/sec
###### Read Capacity Units (RCUs)
* 1 RCU = 1 strongly consistent table read/sec
* 1 RCU = 2 eventually consistent table reads/sec
* In blocks of 4KB
###### Write Capacity Units (WCUs)
* 1 WCU = 1 table write/sec
* In blocks of 1KB

###### Example
* Average Item Size : 10KB
* Provisioned Capacity : 10 RCUs and 10 WCUs
* Read throughput with strong consistency = 4KB * 10 = 40KB/sec
* Read throughput with eventually consistency = 2(4KB * 10) = 80KB/sec
* Write throughput = 1KB * 10 = 10KB/sec
* RCUs to read 10KB of data per second with strong consistency = 10KB/4KB = 2.5 => rounded up => 3 RCUs
* RCUs to read 10KB of data per second with eventually consistency = 3 RCUs * 0.5 = 1.5 RCUs
* WCUs to write 10KB of data per second = 10KB/1KB = 10 WCUs
* WCUs to write 1.5KB of data per second = 1.5KB/1KB = 1.5 => rounded up => 2 WCUs

#### Burst Capacity
* To provide for occasional bursts or spikes
* 5 minutes or 300 seconds of unused read and write capacity
* Can get consumed quickly
* Must not be relied upon
#### Scaling
* Scaling Up : As and when needed
* Scaling Down : Up to 4 times in a day
* `Affects partition behavior (Important!)`
* 1 partition supports up to 1000 WCUs or 3000 RCUs

#### DynamoDB On-Demand Capacity
* AWS now supports On-Demand Capacity mode for DynamoDB. This is in addition to the provisioned capacity mode.
* With on-demand capacity mode, DynamoDB charges you for the data reads and writes your application performs on your tables. You do not need to specify how much read and write throughput you expect for your application to perform because DynamoDB instantly accommodates your workloads as they ramp up or down. 
* On-demand capacity mode might be best if you:
    * Create new tables with unknown workloads.
    * Have unpredictable application traffic.
    * Prefer the ease of paying for only what you use.

#### DynamoDB Partitions
* Store DynamoDB table data
* A table can have multiple partitions
* Number of table partitions depend on it's size and provisioned capacity
* Managed internally by DynamoDB
* 1 partition = 10GB of data
* 1 partition = 1000 WCUs or 3000 RCUs
##### Partition Behavior - Example
* Provisioned Capacity : 500 RCUs and 500 WCUs
  * Number of Partitions
      * P = (500 RCUs/3000 + 500 WCUs/1000) = 0.67 => Rounded up => 1 Partition
* New Capacity : 1000 RCUs and 1000 WCUs
      * P = (1000 RCUs/3000 + 1000 WCUs/1000) = 1.33 => Rounded up => 2 partitions
          * P1 => 500 RCU & 500 WCU
          * P2 => 500 RCU & 500 WCU  => Equally distributed RCU's & WCU's among partitions
* `Note` : We can't brind down the number of partitions once created.

#### DynamoDB Indexes
##### Table Index
* Mandatory Primary Key - Either simple or composite
* Simple Primary Key -> Only Partition/Hash Key
* Composite Primary Key -> Partition Key + Sort/Range key
* Partition/Hash key decides the target partition based on Hashing
###### Hashing
                                          -> P1
  * Partition Key -> Hashing Algorithm
                                          -> P2

##### Local Secondary Index
* Can only create at table creation at max can have 5 LSI
* Should have same partition key of Table Index (primary key) but can have any attribute as sort key

##### Global Secondary Index
* Can Create at any time even after creating the Table
* can have any attribute as partition key or sort key.

#### Different ways to work with DynamoDB
* AWS Management Console
* AWS CLI
* AWS SDK